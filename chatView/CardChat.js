import { View, Alert } from "react-native";
import axios from "axios";
import { BASE_URL } from "../api";
import { client } from "../client";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chatRoomListData,
  conversationData,
  hourMoreLocationData,
  myIdData,
  workProceedingStatusData,
} from "../atom";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";

import * as Location from "expo-location";
import { Text } from "react-native";
import DetailWorkChat from "./DetailWorkChat";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CardContiainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  margin-bottom: 20px;
`;
const CardBubble = styled.View`
  background-color: white;
  border-radius: 10px;
  width: 180px;
`;
const CardTitleWrapper = styled.View`
  background-color: #0fbcf9;
  justify-content: center;
  align-items: flex-start;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 30px;
`;
const CardTitle = styled.Text`
  font-size: 12px;
  font-weight: bold;
  margin: 3px 0px;
  margin-left: 6px;
`;
const PaddingView = styled.View`
  padding: 20px 10px;
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
const MainDescription = styled.Text`
  font-size: 14px;
  color: #555;
  font-weight: bold;
`;
const MoneyText = styled(MainDescription)`
  color: #007bff;
  font-weight: bold;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: lightgray;
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  flex: 1;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;
const Time = styled.Text`
  color: gray;
  margin-bottom: 30px;
  font-size: 12px;
`;
const ProfileView = styled.View`
  flex-direction: row;
  margin-bottom: 220px;
  margin-right: 10px;
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

const CardChat = ({ data, myName, chatList, receiverName }) => {
  const navigation = useNavigation();
  const conversation = useRecoilValue(conversationData);

  const myId = useRecoilValue(myIdData);

  const completeCard = {
    message: "Complete work",
    senderName: myName,
    receiverName: receiverName,
  };
  const finishCard = {
    message: "Finish Work",
    senderName: myName,
    receiverName: receiverName,
  };

  const messageData = JSON.parse(chatList.chatList[0].message);
  const setChatRoomList = useSetRecoilState(chatRoomListData);
  const hourMoreLocation = useRecoilValue(hourMoreLocationData);
  const [workProceedingStatus, setWorkProceedingStatus] = useRecoilState(
    workProceedingStatusData
  );
  const [detailModal, setDetailModal] = useState(false);
  console.log(messageData);
  const onPressDetail = () => {
    setDetailModal(!detailModal);
  };
  //진행상황 보기
  const onPressView = async () => {
    if (messageData.deadLineTime === 1) {
      axios
        .get(`${BASE_URL}/api/location/helperLocations/${messageData.id}`)
        .then((res) => {
          navigation.navigate("HelperLocation", {
            location: res.data,
            isHour: true,
          });
        });
    } else {
      //여기에서 한시간 초과되는 심부름 점 하나 찍어서 보여줌

      navigation.navigate("HelperLocation", {
        isHour: false,
      });
    }
  };
  const handleConfrim = () => {
    Alert.alert(
      "심부름 종료",
      "확인하시면 심부름이 완료되며 채팅방이 사라집니다.",
      [
        {
          text: "확인",
          onPress: async () => {
            await axios
              .put(`${BASE_URL}/api/work/finish/${chatList.workId}`)
              .then(async (res) => {
                const token = await AsyncStorage.getItem("authToken");
                client.publish({
                  destination: `/pub/card/${conversation._id}`,
                  body: JSON.stringify(finishCard),
                  headers: { Authorization: `Bearer ${token}` },
                });
                await axios
                  .post(
                    `${BASE_URL}/api/fcm/chatNotification/${conversation._id}`
                  )
                  .then();
                await axios
                  .get(`${BASE_URL}/api/conversations`)
                  .then(({ data }) => {
                    data.sort(
                      (a, b) => new Date(b.updateAt) - new Date(a.updateAt)
                    );
                    setChatRoomList(data);
                    navigation.goBack();
                  });
              });
          },
        },
        {
          text: "취소",
          style: "cancel",
        },
      ]
    );
  };
  const isCustomer = myId === messageData.customerId;
  return (
    <View>
      {data.message === "Accept work" ? (
        <CardContiainer>
          <Time style={{ marginRight: 5, marginBottom: 5 }}>
            {data.sendTime
              ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(11, 16)}`
              : null}
          </Time>
          <CardBubble>
            <CardTitleWrapper>
              <CardTitle>심부름 매칭 성공</CardTitle>
            </CardTitleWrapper>
            <PaddingView>
              <MainText>심부름 요청서</MainText>
              <MainTitle>{messageData.title}</MainTitle>
              <Divider />
              <MainText mb={true}>상세 정보입니다</MainText>
              <MainDescription>{messageData.context}</MainDescription>
              <MainDescription>
                마감시간 : {messageData.deadLineTime}시간
              </MainDescription>
              <View style={{ flexDirection: "row" }}>
                <MainDescription>보상금액: </MainDescription>
                <MoneyText>{messageData.reward}원</MoneyText>
              </View>
              <DetailWorkChat
                messageData={messageData}
                detailModal={detailModal}
                setDetailModal={setDetailModal}
                myName={myName}
                receiverName={receiverName}
              />
              {workProceedingStatus === 1 ? (
                <ButtonContainer>
                  <ActionButton
                    onPress={isCustomer ? onPressView : onPressDetail}
                  >
                    <ButtonText>
                      {isCustomer ? "진행상황 보기" : "상세보기"}
                    </ButtonText>
                  </ActionButton>
                </ButtonContainer>
              ) : null}
            </PaddingView>
          </CardBubble>
        </CardContiainer>
      ) : data.message === "Complete work" ? (
        myId !== messageData.customerId ? (
          <CardContiainer>
            <Time style={{ marginBottom: 0, marginRight: 5 }}>
              {data.sendTime
                ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(11, 16)}`
                : null}
            </Time>
            <CardBubble>
              <CardTitleWrapper>
                <CardTitle>심부름 완료</CardTitle>
              </CardTitleWrapper>
              <PaddingView>
                <MainText>심부름 요청서</MainText>
                <MainTitle>{messageData.title}</MainTitle>
                <Divider />
                <MainText mb={true}>상세 정보입니다</MainText>
                <MainDescription>{messageData.context}</MainDescription>
                <MainDescription>
                  마감시간 : {messageData.deadLineTime}시간
                </MainDescription>
                <View style={{ flexDirection: "row" }}>
                  <MainDescription>보상금액: </MainDescription>
                  <MoneyText>{messageData.reward}원</MoneyText>
                </View>
                <View>
                  <Text
                    style={{
                      color: "#666",
                      marginTop: 10,
                      textAlign: "center",
                    }}
                  >
                    완료 확인중...
                  </Text>
                </View>
              </PaddingView>
            </CardBubble>
          </CardContiainer>
        ) : (
          <CardContiainer style={{ justifyContent: "flex-start" }}>
            <View style={{ flexDirection: "row" }}>
              <ProfileView>
                <ProfileImage>
                  <Text>사진</Text>
                </ProfileImage>
                <Text style={{ fontWeight: "bold" }}>{data.senderName}</Text>
              </ProfileView>
              <CardBubble>
                <CardTitleWrapper>
                  <CardTitle>심부름 완료 확인</CardTitle>
                </CardTitleWrapper>
                <PaddingView>
                  <MainText>심부름 요청서</MainText>
                  <MainTitle>{messageData.title}</MainTitle>
                  <Divider />
                  <MainText mb={true}>상세 정보입니다</MainText>
                  <MainDescription>{messageData.context}</MainDescription>
                  <MainDescription>
                    마감시간 : {messageData.deadLineTime}시간
                  </MainDescription>
                  <View style={{ flexDirection: "row" }}>
                    <MainDescription>보상금액: </MainDescription>
                    <MoneyText>{messageData.reward}원</MoneyText>
                  </View>
                  <ButtonContainer style={{ marginTop: 20 }}>
                    <ActionButton onPress={handleConfrim}>
                      <ButtonText>확인하기</ButtonText>
                    </ActionButton>
                  </ButtonContainer>
                </PaddingView>
              </CardBubble>
            </View>

            <Time>
              {data.sendTime
                ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(11, 16)}`
                : null}
            </Time>
          </CardContiainer>
        )
      ) : data.message === "Deny Work" ? (
        myId !== messageData.customerId ? (
          <CardContiainer>
            <Time>
              {data.sendTime
                ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(11, 16)}`
                : null}
            </Time>
            <CardBubble>
              <CardTitleWrapper>
                <CardTitle>심부름 거절</CardTitle>
              </CardTitleWrapper>
              <PaddingView>
                <MainText>심부름을 거절하였습니다</MainText>
              </PaddingView>
            </CardBubble>
          </CardContiainer>
        ) : (
          <CardContiainer style={{ justifyContent: "flex-start" }}>
            <CardBubble>
              <CardTitleWrapper>
                <CardTitle>심부름 거절</CardTitle>
              </CardTitleWrapper>
              <PaddingView>
                <MainText>심부름이 거절되었습니다</MainText>
              </PaddingView>
            </CardBubble>
            <Time>
              {data.sendTime
                ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(11, 16)}`
                : null}
            </Time>
          </CardContiainer>
        )
      ) : null}
    </View>
  );
};

export default CardChat;
