import { Pressable, View, Text } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components/native";
import { conversationData, isTimerData, myIdData } from "../atom";
import axios from "axios";
import { BASE_URL } from "../api";
import { client } from "../client";
import { Alert } from "react-native";
import * as Location from "expo-location";
import BackgroundTimer from "react-native-background-timer";
import { useState } from "react";

const WorkBubble = styled.View`
  background-color: #e4eaf2;
  border-radius: 10px;
  padding: 15px;
  margin: 5px;
  width: 50%;
  margin-bottom: 10px;
`;
const Divider = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  margin: 8px 0;
`;
const WorkTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
  text-align: center;
  color: #333;
`;
const WorkText = styled.Text`
  color: #555;
  font-size: 14px;
  margin-bottom: 6px;
`;
const DeadlineText = styled.Text`
  font-size: 12px;
  color: #777;
`;

const WorkTitleWrapper = styled.View`
  background-color: #7f8fa6;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 30px;
`;
const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;
const Spacer = styled.View`
  width: 2%;
`;
const WorkBtn = styled.Pressable`
  background-color: ${(props) => (props.accept ? "#3498db" : "#e74c3c")};
  width: 80px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const WorkBtnText = styled.Text`
  color: white;
  font-weight: 600;
`;

const WorkChat = ({
  data,
  myName,
  chatList,
  index,
  receiverName,
  creatorId,
}) => {
  const messageData = JSON.parse(data.message);
  const myId = useRecoilValue(myIdData);
  const conversation = useRecoilValue(conversationData);
  const AcceptCard = {
    message: "Accept work",
    senderName: myName,
    receiverName: receiverName,
  };

  const [isTimer, isSetTimer] = useRecoilState(isTimerData);

  const intervalId = (id) => {
    if (isTimer) {
      BackgroundTimer.setInterval(async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
          setOk("error");
        }
        const {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({ accuracy: 5 });
        console.log(latitude, longitude);
        axios
          .post(`${BASE_URL}/api/location/helperLocation/${id}`, {
            latitude,
            longitude,
          })
          .then((res) => {
            console.log("위치데이터", res.data);
          })
          .catch((error) => console.log(error));
      }, 10000); //isFinish true면 타이머 멈추고 아닐경우 타이머 하게하기
    }
  };
  const onPressAccept = (index) => {
    //헬퍼가 심부름 수락시
    const work = JSON.parse(chatList.chatList[index].message);
    axios
      .put(`${BASE_URL}/api/work/matching`, {
        id: work.id,
        title: work.title,
        context: work.context,
        deadLineTime: work.deadLineTime,
        reward: work.reward,
        latitude: work.latitude,
        longitude: work.longitude,
        proceeding: work.proceeding,
        customerId: work.customerId,
        helperId:
          myId === conversation.participantId
            ? conversation.creatorId
            : conversation.participantId,
        finished: work.finished,
      })
      .then((res) => {
        client.publish({
          destination: `/pub/card/${conversation._id}`,
          body: JSON.stringify(AcceptCard),
        });

        if (work.deadLineTime === 1) {
          intervalId(work.id);
        } else {
          console.log("마감시간 1시간 초과");
        }
      })
      .catch((error) => {
        Alert.alert(error.response.data.message);
      });
  };
  const onPressDeny = () => {
    if (chatList.participatorName === myName) {
      Alert.alert("거절되었습니다.");
    }
  };

  const onPressCheck = () => {
    const work = JSON.parse(chatList.chatList[index].message);
    axios
      .put(`${BASE_URL}/api/work/matching`, {
        id: work.id,
        title: work.title,
        context: work.context,
        deadLineTime: work.deadLineTime,
        reward: work.reward,
        latitude: work.latitude,
        longitude: work.longitude,
        proceeding: work.proceeding,
        customerId: work.customerId,
        helperId:
          myId === conversation.participantId
            ? conversation.creatorId
            : conversation.participantId,
        finished: work.finished,
      })
      .then((res) => {
        client.publish({
          destination: `/pub/card/${conversation._id}`,
          body: JSON.stringify(AcceptCard),
        });

        if (work.deadLineTime === 1) {
          intervalId(work.id);
        } else {
        }
      })
      .catch((error) => Alert.alert(error.response.data.message));
  };
  const customerId = JSON.parse(data.message).customerId;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: data.senderName === myName ? "flex-end" : "flex-start",
      }}
    >
      {myId === customerId ? (
        myId === creatorId ? (
          <WorkBubble>
            <WorkTitle>심부름 요청서</WorkTitle>
            <Divider />
            <WorkText>제목 : {messageData.title}</WorkText>
            <WorkText>내용 : {messageData.context}</WorkText>
            <DeadlineText>
              마감시간 : {messageData.deadLineTime}시간
            </DeadlineText>
          </WorkBubble>
        ) : (
          <WorkBubble style={{ width: 200 }}>
            <WorkTitleWrapper>
              <WorkTitle>심부름 검증서</WorkTitle>
            </WorkTitleWrapper>

            <Pressable
              style={{
                flex: 2,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 25,
              }}
              onPress={onPressCheck}
            >
              <Text
                style={{
                  backgroundColor: "#7f8fa6",
                  width: 100,

                  textAlign: "center",
                  borderRadius: 10,
                  color: "#dcdde1",
                }}
              >
                수락
              </Text>
            </Pressable>
          </WorkBubble>
        )
      ) : myId !== creatorId ? (
        <WorkBubble>
          <WorkTitle>심부름 요청서</WorkTitle>
          <WorkText>제목 : {messageData.title}</WorkText>
          <WorkText>내용 : {messageData.context}</WorkText>
          <DeadlineText>
            마감시간 : {messageData.deadLineTime}
            시간
          </DeadlineText>
          <ButtonContainer>
            <WorkBtn accept={true} onPress={() => onPressAccept(index)}>
              <WorkBtnText>수락</WorkBtnText>
            </WorkBtn>
            <Spacer />
            <WorkBtn accept={false} onPress={onPressDeny}>
              <WorkBtnText>거절</WorkBtnText>
            </WorkBtn>
          </ButtonContainer>
        </WorkBubble>
      ) : (
        <WorkBubble style={{ width: 200 }}>
          <WorkTitleWrapper>
            <WorkTitle>심부름 검증서</WorkTitle>
          </WorkTitleWrapper>
          <View
            style={{
              flex: 2,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 25,
            }}
          ></View>
        </WorkBubble>
      )}
    </View>
  );
};

export default WorkChat;
