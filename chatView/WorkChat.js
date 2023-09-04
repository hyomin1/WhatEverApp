import { Pressable, View, Text, TouchableOpacity } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components/native";
import {
  accessData,
  conversationData,
  isTimerData,
  myIdData,
  workProceedingStatusData,
  workStatusCodeData,
} from "../atom";
import axios from "axios";
import { BASE_URL } from "../api";
import { client } from "../client";
import { Alert } from "react-native";
import * as Location from "expo-location";
import BackgroundTimer from "react-native-background-timer";
import React, { useState } from "react";
import { Button } from "react-native-web";
import ErrandRequest from "./ErrandRequest";
import DetailWork from "../mainView/DetailWork";
import DetailWorkChat from "./DetailWorkChat";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
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
  //padding: 20px 10px;
  padding: 20px 10px;
  justify-content: center;
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
const LocationBtn = styled.TouchableOpacity`
  background-color: lightgray;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-top: 10px;
  padding: 5px 0px;
`;
const LocationText = styled.Text`
  color: #666;
  font-size: 13px;
  padding: 1px 0px;
  font-weight: bold;
`;

const WorkText = styled.Text`
  color: #555;
  font-size: 14px;
  margin-bottom: 6px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
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
  const [workProceedingStatus, setWorkProceedingStatus] = useRecoilState(
    workProceedingStatusData
  );
  const [detailModal, setDetailModal] = useState(false);
  const [address, setAddress] = useState({
    city: "",
    borough: "",
    quarter: "",
    road: "",
  });
  const AcceptCard = {
    message: "Accept work",
    senderName: myName,
    receiverName: receiverName,
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
          work.customerId === chatList.participantId
            ? chatList.creatorId
            : chatList.participantId,
        finished: work.finished,
      })
      .then((res) => {
        client.publish({
          destination: `/pub/card/${chatList._id}`,
          body: JSON.stringify(AcceptCard),
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        axios
          .post(`${BASE_URL}/api/fcm/chatNotification/${chatList._id}`)
          .then();
        if (work.deadLineTime === 1) {
          //마감시간 1시간일 경우
          intervalId(work.id); //서버에 현재위치 계속 보내줌
        }
      })
      .catch((error) => Alert.alert(error.response.data.message));
  };
  const customerId = JSON.parse(data.message).customerId;
  const navigation = useNavigation();

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
                <WorkTitle>심부름 요청서 전송</WorkTitle>
              </WorkTitleWrapper>
              <PaddingView>
                <MainText>심부름 요청서</MainText>
                <MainTitle>{messageData.title}</MainTitle>
                <Divider />
                {workProceedingStatus === 0 ? (
                  <LocationBtn onPress={() => setDetailModal(!detailModal)}>
                    <LocationText>상세보기</LocationText>
                  </LocationBtn>
                ) : null}
                <DetailWorkChat
                  detailModal={detailModal}
                  setDetailModal={setDetailModal}
                  messageData={messageData}
                  address={address}
                  myName={myName}
                  receiverName={receiverName}
                />
              </PaddingView>
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
              {workProceedingStatus === 0 ? (
                <LocationBtn onPress={() => setDetailModal(!detailModal)}>
                  <LocationText>상세보기</LocationText>
                </LocationBtn>
              ) : null}
              <DetailWorkChat
                detailModal={detailModal}
                setDetailModal={setDetailModal}
                messageData={messageData}
                address={address}
                myName={myName}
                receiverName={receiverName}
              />
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
