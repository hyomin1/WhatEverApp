import { View } from "react-native";
import { useRecoilValue } from "recoil";
import styled from "styled-components/native";
import { conversationData, myIdData } from "../atom";
import axios from "axios";
import { BASE_URL } from "../api";
import { client } from "../client";
import { Alert } from "react-native";
import * as Location from "expo-location";
import BackgroundTimer from "react-native-background-timer";
import { useState } from "react";

const WorkWrapper = styled.View`
  background-color: #dcdde1;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  width: 250px;
  margin-bottom: 10px;
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
const WorkTextView = styled.View`
  flex: 5;
  padding-top: 10px;
  margin-left: 20px;
  width: 250px;
`;
const WorkTitle = styled.Text`
  margin-left: 10px;
  font-size: 14px;
  font-weight: 800;
`;
const WorkBtn = styled.Pressable`
  background-color: #2196f3;
  width: 30%;
  justify-content: center;
  align-items: center;
  border: 2px solid white;
  border-radius: 10px;
  margin-right: 2px;
  margin-left: 2px;
  margin-bottom: 5px;
`;
const WorkText = styled.Text`
  color: black;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 5px;
`;
const WorkAcceptText = styled.Text`
  color: black;
  font-weight: 600;
  font-size: 19px;
`;

const WorkChat = ({ data, myName, chatList, index, receiverName }) => {
  const myId = useRecoilValue(myIdData);
  const conversation = useRecoilValue(conversationData);
  const AcceptCard = {
    message: "Accept work",
    senderName: myName,
    receiverName: receiverName,
  };
  const [click, setClick] = useState(false);
  const [accept, setAccept] = useState(false);
  const [deny, setDeny] = useState(false);

  const intervalId = (id) => {
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
          latitude: latitude,
          longitude: longitude,
        })
        .then((res) => {
          console.log("위치데이터", res.data);
        })
        .catch((error) => console.log(error));
    }, 10000); //isFinish true면 타이머 멈추고 아닐경우 타이머 하게하기
  };
  const onPressAccept = (index) => {
    setClick(true);
    setAccept(true);
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
        helperId: conversation.participantId,
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
      .catch((error) => console.log("accept", error));
  };
  const onPressDeny = () => {
    setClick(true);
    setDeny(true);
    if (chatList.participatorName === myName) {
      Alert.alert("거절되었습니다.");
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: data.senderName === myName ? "flex-end" : "flex-start",
      }}
    >
      {/*<Time>{data.sendTime.slice(0, 16)}</Time>*/}
      <WorkWrapper>
        <WorkTitleWrapper>
          <WorkTitle>심부름 요청서</WorkTitle>
        </WorkTitleWrapper>
        <WorkTextView>
          <WorkText>제목 : {JSON.parse(data.message).title}</WorkText>
          <WorkText>내용 : {JSON.parse(data.message).context}</WorkText>
          <WorkText>
            마감시간 : {JSON.parse(data.message).deadLineTime}
            시간
          </WorkText>
        </WorkTextView>
        {myId === chatList.participantId ? (
          <View
            style={{
              flexDirection: "row",
            }}
          >
            {!click && !accept ? (
              <WorkBtn onPress={() => onPressAccept(index)}>
                <WorkAcceptText>수락</WorkAcceptText>
              </WorkBtn>
            ) : (
              click &&
              accept && <WorkAcceptText>수락한 심부름입니다</WorkAcceptText>
            )}
            {!click && !deny ? (
              <WorkBtn onPress={onPressDeny}>
                <WorkAcceptText>거절</WorkAcceptText>
              </WorkBtn>
            ) : (
              click &&
              deny && <WorkAcceptText>거절한 심부름입니다</WorkAcceptText>
            )}
          </View>
        ) : null}
      </WorkWrapper>
    </View>
  );
};

export default WorkChat;
