import { Pressable, View, Text, TouchableOpacity } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components/native";
import { conversationData, myIdData, workProceedingStatusData } from "../atom";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  font-weight: bold;
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
const Time = styled.Text`
  color: gray;
  margin-bottom: 10px;
  font-size: 12px;
`;
const ProfileView = styled.View`
  flex-direction: row;
  margin-bottom: 85px;
  margin-right: 10px;
`;
const ProfileView2 = styled(ProfileView)`
  margin-bottom: 90px;
`;
const ProfileImage = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: white;
  justify-content: center;
  align-items: center;
  margin-right: 3px;
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
                  <LocationBtn
                    onPress={() => {
                      setDetailModal(!detailModal);
                    }}
                  >
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
                  validate={false}
                />
              </PaddingView>
            </WorkBubble>
          </WorkContiainer>
        ) : (
          <WorkContiainer>
            <ProfileView2>
              <ProfileImage>
                <Text>사진</Text>
              </ProfileImage>
              <Text style={{ fontWeight: "bold" }}>{data.senderName}</Text>
            </ProfileView2>
            <WorkBubble>
              <WorkTitleWrapper>
                <WorkTitle>심부름 검증서 도착</WorkTitle>
              </WorkTitleWrapper>
              <PaddingView>
                <MainText>심부름 검증서</MainText>
                <MainTitle>{messageData.title}</MainTitle>
                <Divider />
                {workProceedingStatus === 0 ? (
                  <LocationBtn
                    onPress={() => {
                      setDetailModal(!detailModal);
                    }}
                  >
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
                  validate={true}
                />
              </PaddingView>
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
          <ProfileView>
            <ProfileImage>
              <Text>사진</Text>
            </ProfileImage>
            <Text style={{ color: "black", fontWeight: "bold" }}>
              {data.senderName}
            </Text>
          </ProfileView>

          <WorkBubble>
            <WorkTitleWrapper>
              <WorkTitle>심부름 요청서 도착</WorkTitle>
            </WorkTitleWrapper>
            <PaddingView>
              <MainText>심부름 요청서</MainText>
              <MainTitle>{messageData.title}</MainTitle>
              <Divider />
              {workProceedingStatus === 0 ? (
                <LocationBtn
                  onPress={async () => {
                    try {
                      const res = await axios.get(
                        `${BASE_URL}/api/work/${messageData.id}`
                      );
                      if (res.data.workProceedingStatus === 1) {
                        Alert.alert("다른 헬퍼가 심부름을 진행 중 입니다.");
                      } else {
                        setDetailModal(!detailModal);
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
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
                validate={false}
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
        <WorkContiainer style={{ justifyContent: "flex-end" }}>
          <Time>
            {data.sendTime
              ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(11, 16)}`
              : null}
          </Time>
          <WorkBubble>
            <WorkTitleWrapper>
              <WorkTitle>심부름 검증서 전송</WorkTitle>
            </WorkTitleWrapper>
            <PaddingView>
              <MainText>심부름 검증서</MainText>
              <MainTitle>{messageData.title}</MainTitle>
              <Divider />

              {workProceedingStatus === 0 ? (
                <LocationBtn
                  onPress={() => {
                    setDetailModal(!detailModal);
                  }}
                  style={{ width: "80%", alignSelf: "center" }}
                >
                  <LocationText>상세보기</LocationText>
                  <DetailWorkChat
                    detailModal={detailModal}
                    setDetailModal={setDetailModal}
                    messageData={messageData}
                    address={address}
                    myName={myName}
                    receiverName={receiverName}
                    validate={true}
                  />
                </LocationBtn>
              ) : null}
            </PaddingView>
          </WorkBubble>
        </WorkContiainer>
      )}
    </View>
  );
};

export default WorkChat;
