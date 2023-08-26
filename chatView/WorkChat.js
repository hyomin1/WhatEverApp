import { Pressable, View, Text } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components/native";
import {
  accessData,
  conversationData,
  isTimerData,
  myIdData,
  workStatusCodeData,
} from "../atom";
import axios from "axios";
import { BASE_URL } from "../api";
import { client } from "../client";
import { Alert } from "react-native";
import * as Location from "expo-location";
import BackgroundTimer from "react-native-background-timer";
import React from "react";
import { Button } from "react-native-web";
import ErrandRequest from "./ErrandRequest";
const WorkContiainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
`;
const WorkBubble = styled.View`
  background-color: white;
  border-radius: 10px;
  margin: 5px;
  width: 50%;
  margin-bottom: 10px;
`;

const WorkTitleWrapper = styled.View`
  background-color: #0fbcf9;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 30px;
`;
const WorkTitle = styled.Text`
  font-size: 12px;
  font-weight: bold;
  margin: 4px 0px;
  margin-left: 6px;
`;
const PaddingView = styled.View`
  padding: 20px 10px;
`;
const MainText = styled.Text`
  color: #888;
  font-size: 12px;
`;
const MainTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;
const Divider = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  margin: 8px 0;
`;
const MainDescription = styled.Text`
  font-size: 13px;
  color: #555;
  font-weight: bold;
`;
const MoneyText = styled(MainDescription)`
  color: #007bff;
`;
const WorkText = styled.Text`
  color: #555;
  font-size: 14px;
  margin-bottom: 6px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;
const Spacer = styled.View`
  width: 2%;
`;
const WorkBtn = styled.TouchableOpacity`
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
const Time = styled.Text`
  color: gray;
  margin-bottom: 10px;
  font-size: 12px;
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
  const accessToken = useRecoilValue(accessData);
  const [workStatusCode, setWorkStatusCode] =
    useRecoilState(workStatusCodeData);
  const AcceptCard = {
    message: "Accept work",
    senderName: myName,
    receiverName: receiverName,
  };

  //const [isTimer, isSetTimer] = useRecoilState(isTimerData);

  const intervalId = (id) => {
    BackgroundTimer.setInterval(async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        setOk("error");
      }
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      // console.log(latitude, longitude);
      axios
        .post(`${BASE_URL}/api/location/helperLocation/${id}`, {
          latitude,
          longitude,
        })
        .then((res) => {
          //console.log("위치데이터", res.data);
        })
        .catch((error) => console.log(error));
    }, 10000); //isFinish true면 타이머 멈추고 아닐경우 타이머 하게하기
  };
  const onPressAccept = (index) => {
    //헬퍼가 심부름 수락시
    const work = JSON.parse(chatList.chatList[index].message);
    console.log(work.id);
    axios
      .put(`${BASE_URL}/api/work/matching/${chatList._id}`, {
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
          work.customerId === conversation.participantId
            ? conversation.creatorId
            : conversation.participantId,
        finished: work.finished,
      })
      .then(({ data }) => {
        client.publish({
          destination: `/pub/card/${conversation._id}`,
          body: JSON.stringify(AcceptCard),
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        axios.post(`${BASE_URL}/api/fcm/${conversation._id}`).then();
        console.log(data.workProceedingStatus);
        if (work.deadLineTime === 1) {
          intervalId(work.id);
          setWorkStatusCode(data.workProceedingStatus);
        } else {
          console.log("마감시간 1시간 초과");
        }
      })
      .catch((error) => {
        Alert.alert(error.response.data.message);
        console.log(error.response.data.message);
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
      .put(`${BASE_URL}/api/work/matching/${chatList._id}`, {
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
          work.customerId === conversation.participantId
            ? conversation.creatorId
            : conversation.participantId,
        finished: work.finished,
      })
      .then((res) => {
        client.publish({
          destination: `/pub/card/${conversation._id}`,
          body: JSON.stringify(AcceptCard),
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (work.deadLineTime === 1) {
          intervalId(work.id);
        } else {
        }
      })
      .catch((error) => Alert.alert(error.response.data.message));
  };
  const customerId = JSON.parse(data.message).customerId;
  console.log(workStatusCode);
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
          <WorkContiainer style={{ justifyContent: "flex-end" }}>
            <Time>
              {data.sendTime
                ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(11, 16)}`
                : null}
            </Time>
            <WorkBubble>
              <WorkTitleWrapper>
                <WorkTitle>심부름 요청서 도착</WorkTitle>
              </WorkTitleWrapper>
              <ErrandRequest messageData={messageData} />
            </WorkBubble>
          </WorkContiainer>
        ) : (
          <WorkContiainer>
            <WorkBubble>
              <WorkTitleWrapper>
                <WorkTitle>심부름 검증서</WorkTitle>
              </WorkTitleWrapper>
              <ErrandRequest messageData={messageData} />
              <ButtonContainer
                style={{ justifyContent: "center", padding: 20 }}
              >
                <WorkBtn onPress={onPressCheck} accept={true}>
                  <WorkBtnText>승낙</WorkBtnText>
                </WorkBtn>
              </ButtonContainer>
            </WorkBubble>
            <Time>
              {data.sendTime
                ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(11, 16)}`
                : null}
            </Time>
          </WorkContiainer>
        )
      ) : myId !== creatorId ? (
        <WorkContiainer>
          <WorkBubble>
            <WorkTitleWrapper>
              <WorkTitle>심부름 요청서 도착</WorkTitle>
            </WorkTitleWrapper>
            <PaddingView>
              <MainText>심부름 요청서</MainText>
              <MainTitle>{messageData.title}</MainTitle>
              <Divider />
              <MainText>상세 정보입니다</MainText>
              <MainDescription>{messageData.context}</MainDescription>
              <MainDescription>
                마감시간 : {messageData.deadLineTime}시간
              </MainDescription>
              <View style={{ flexDirection: "row" }}>
                <MainDescription>보상금액: </MainDescription>
                <MoneyText>{messageData.reward}원</MoneyText>
              </View>
              {
                //workStatusCode !== 1 && workStatusCode !== 2 ? (
                <ButtonContainer>
                  <WorkBtn accept={true} onPress={() => onPressAccept(index)}>
                    <WorkBtnText>수락</WorkBtnText>
                  </WorkBtn>
                  <Spacer />
                  <WorkBtn accept={false} onPress={onPressDeny}>
                    <WorkBtnText>거절</WorkBtnText>
                  </WorkBtn>
                </ButtonContainer>
                // ) : null
              }
            </PaddingView>
          </WorkBubble>
          <Time>
            {data.sendTime
              ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(11, 16)}`
              : null}
          </Time>
        </WorkContiainer>
      ) : (
        <WorkContiainer>
          <WorkBubble>
            <WorkTitleWrapper>
              <WorkTitle>심부름 검증서</WorkTitle>
            </WorkTitleWrapper>
            <ErrandRequest messageData={messageData} />
            <WorkText style={{ textAlign: "center" }}>검증 대기중...</WorkText>
          </WorkBubble>
          <Time>
            {data.sendTime
              ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(11, 16)}`
              : null}
          </Time>
        </WorkContiainer>
      )}
    </View>
  );
};

export default WorkChat;
