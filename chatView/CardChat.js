import { View, Modal, Alert } from "react-native";
import axios from "axios";
import { BASE_URL } from "../api";
import { client } from "../client";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  accessData,
  conversationData,
  historyWorkData,
  isTimerData,
  myIdData,
} from "../atom";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { useState } from "react";
import Rating from "./Rating";
import * as Location from "expo-location";
import { Text } from "react-native";
const CardBubble = styled.View`
  background-color: white;
  border-radius: 10px;
  margin: 5px;
  width: 50%;
  margin-bottom: 20px;
`;
const CardTitleWrapper = styled.View`
  background-color: #0fbcf9;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 30px;
`;
const CardTitle = styled.Text`
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

const CardContainer = styled.View`
  background-color: #e4eaf2;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  width: 50%;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 40px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  flex: 1;
  margin: 0 4px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

const CardChat = ({ data, myName, chatList, receiverName }) => {
  const navigation = useNavigation();
  const conversation = useRecoilValue(conversationData);
  const myId = useRecoilValue(myIdData);
  const accessToken = useRecoilValue(accessData);
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

  const [isTimer, isSetTimer] = useRecoilState(isTimerData);
  const messageData = JSON.parse(chatList.chatList[0].message); //workId찾아서 그 workId로 일 보이게

  const onPressWorkComplete = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk("error");
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    await axios
      .put(`${BASE_URL}/api/work/success/${chatList.workId}`, {
        latitude,
        longitude,
      })
      .then((res) => {
        client.publish({
          destination: `/pub/card/${conversation._id}`,
          body: JSON.stringify(completeCard),
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      })
      .catch((error) => {
        Alert.alert(error.response.data.message);
      });

    isSetTimer(false);
  };

  const onPressView = () => {
    console.log(messageData.deadLineTime);
    if (messageData.deadLineTime === 1) {
      axios
        .get(`${BASE_URL}/api/location/helperLocation/${messageData.id}`)
        .then((res) => {
          navigation.navigate("HelperLocation", {
            location: res.data,
          });
        });
    } else {
      console.log("마감시간 한시간 초과");
    }
    //진행상황 보기
  };
  const handleConfrim = () => {
    Alert.alert(
      "심부름 종료",
      "확인하시면 심부름이 완료되며 채팅방이 사라집니다.",
      [
        {
          text: "확인",
          onPress: () => {
            axios
              .put(`${BASE_URL}/api/work/finish/${chatList.workId}`)
              .then((res) => {
                client.publish({
                  destination: `/pub/card/${conversation._id}`,
                  body: JSON.stringify(finishCard),
                  headers: { Authorization: `Bearer ${accessToken}` },
                });
                navigation.navigate("Chat");
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
  //console.log("카드챗", messageData);
  const isCustomer = myId === messageData.customerId;
  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
      {data.message === "Accept work" ? (
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
            <ButtonContainer>
              <ActionButton
                onPress={isCustomer ? onPressView : onPressWorkComplete}
              >
                <ButtonText>
                  {isCustomer ? "진행상황 보기" : "심부름 완료하기"}
                </ButtonText>
              </ActionButton>
            </ButtonContainer>
          </PaddingView>
          <Divider />
        </CardBubble>
      ) : data.message === "Complete work" ? (
        myId !== messageData.customerId ? (
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
                  style={{ color: "#666", marginTop: 10, textAlign: "center" }}
                >
                  완료 확인중...
                </Text>
              </View>
            </PaddingView>
          </CardBubble>
        ) : (
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
              <ButtonContainer>
                <ActionButton onPress={handleConfrim}>
                  <ButtonText>확인하기</ButtonText>
                </ActionButton>
              </ButtonContainer>
            </PaddingView>
          </CardBubble>
        )
      ) : data.message === "Finish Work" ? (
        <CardContainer>
          <CardTitle>심부름 종료</CardTitle>
          <Divider />
          {
            myId !== messageData.customerId ? (
              <ButtonContainer>
                <ActionButton>
                  <ButtonText>헬퍼 입장 종료</ButtonText>
                </ActionButton>
              </ButtonContainer>
            ) : null
            // <ButtonContainer>
            //   <ActionButton onPress={() => isSetStarRating((cur) => !cur)}>
            //     <ButtonText>후기 작성</ButtonText>
            //   </ActionButton>
            //   <Modal animationType="slide" visible={isStarRating}>
            //     <Rating
            //       workId={chatList.workId}
            //       isSetStarRating={isSetStarRating}
            //     />
            //   </Modal>
            // </ButtonContainer>
          }
        </CardContainer>
      ) : null}
    </View>
  );
};

export default CardChat;
