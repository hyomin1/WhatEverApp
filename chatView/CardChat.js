import { View, Modal, Alert } from "react-native";
import axios from "axios";
import { BASE_URL } from "../api";
import { client } from "../client";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
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

const CardTitleWrapper = styled.View`
  background-color: #ffcd02;
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  align-items: center;
`;

const CardBtn = styled.TouchableOpacity`
  background-color: #ffcd02;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
  margin-top: 16px;
`;
const CardText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;
const CardContainer = styled.View`
  background-color: #e4eaf2;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  width: 50%;
`;
const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 4px;
`;
const Divider = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  margin: 8px 0;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 12px;
  border-radius: 5px;
  align-items: center;
  flex: 1;
  margin: 0 4px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const CardChat = ({ data, myName, chatList, receiverName }) => {
  const navigation = useNavigation();
  const conversation = useRecoilValue(conversationData);
  const myId = useRecoilValue(myIdData);
  const [historyWork, setHistoryWork] = useRecoilState(historyWorkData);
  const [isStarRating, isSetStarRating] = useState(false);
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

  const [isFinish, setIsFinish] = useState(true);
  const [isTimer, isSetTimer] = useRecoilState(isTimerData);
  const messageData = JSON.parse(chatList.chatList[0].message);

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
        //latitude,
        //longitude,
      })
      .then((res) => {
        client.publish({
          destination: `/pub/card/${conversation._id}`,
          body: JSON.stringify(completeCard),
        });
      })
      .catch((error) => {
        Alert.alert(error.response.data.message);
        console.log(error);
      });

    isSetTimer(false);
  };
  const onPressView = () => {
    if (messageData.deadLineTime === 1) {
      axios
        .get(`${BASE_URL}/api/location/helperLocation/${messageData.id}`)
        .then((res) => {
          console.log(res.data);
          console.log(messageData.id);
          // navigation.navigate("HelperLocation", {
          //   location: res.data,
          // });
        });
    } else {
      console.log("마감시간 한시간 초과");
    }
    //진행상황 보기
  };
  const isCustomer = myId === messageData.customerId;
  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
      {data.message === "Accept work" ? (
        <CardContainer>
          <CardTitle>심부름 매칭 성공</CardTitle>
          <Divider />
          <ButtonContainer>
            <ActionButton
              onPress={isCustomer ? onPressView : onPressWorkComplete}
            >
              <ButtonText>
                {isCustomer ? "진행상황 보기" : "심부름 완료하기"}
              </ButtonText>
            </ActionButton>
          </ButtonContainer>
        </CardContainer>
      ) : data.message === "Complete work" ? (
        myId !== messageData.customerId ? (
          <CardContainer>
            <CardTitleWrapper>
              <CardTitle>상대방의 수락 기다리는중</CardTitle>
            </CardTitleWrapper>
            <CardBtn></CardBtn>
          </CardContainer>
        ) : (
          <CardContainer>
            <CardTitleWrapper>
              <CardTitle>심부름 완료 확인</CardTitle>
            </CardTitleWrapper>
            <CardBtn
              onPress={() => {
                axios
                  .put(`${BASE_URL}/api/work/finish/${chatList.workId}`)
                  .then(({ data }) => {
                    //console.log("finish", data);
                    client.publish({
                      destination: `/pub/card/${conversation._id}`,
                      body: JSON.stringify(finishCard),
                    });
                    isSetTimer(false);
                    setHistoryWork([...historyWork, data]);
                  });
              }}
            >
              <CardText>확인하기</CardText>
            </CardBtn>
          </CardContainer>
        )
      ) : data.message === "Finish Work" ? (
        <CardContainer>
          <CardTitleWrapper>
            <CardTitle>심부름이 종료되었습니다</CardTitle>
          </CardTitleWrapper>
          {myId !== messageData.customerId ? (
            <CardBtn>
              <CardText>헬퍼입장 종료</CardText>
            </CardBtn>
          ) : (
            <View>
              <CardBtn onPress={() => isSetStarRating((cur) => !cur)}>
                <CardText>별점 평가</CardText>
              </CardBtn>
              <Modal animationType="slide" visible={isStarRating}>
                <Rating
                  workId={chatList.workId}
                  isSetStarRating={isSetStarRating}
                />
              </Modal>
            </View>
          )}
        </CardContainer>
      ) : null}
    </View>
  );
};

export default CardChat;
