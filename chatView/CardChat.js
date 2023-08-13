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

const CardWrapper = styled.View`
  height: 100px;
  width: 200px;
  background-color: #dcdde1;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;
const CardTitleWrapper = styled.View`
  background-color: #7f8fa6;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 30px;
`;
const CardTitle = styled.Text`
  margin-left: 10px;
  font-size: 14px;
  font-weight: 800;
  color: black;
`;
const CardBtn = styled.Pressable`
  flex: 2;
  justify-content: center;
  align-items: center;
`;
const CardText = styled.Text`
  background-color: #7f8fa6;
  width: 100px;
  text-align: center;
  border-radius: 10px;
  color: #dcdde1;
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
        });
      })
      .catch((error) => {
        Alert.alert(error.response.data.message);
        console.log(error);
      });

    isSetTimer(false);
  };
  const onPressView = () => {
    console.log("진행 상황 보기");
    if (JSON.parse(chatList.chatList[0].message).deadLineTime === 1) {
      console.log("마감시간 한시간");
      axios
        .get(
          `${BASE_URL}/api/location/helperLocation/${
            JSON.parse(chatList.chatList[0].message).id
          }`
        )
        .then((res) => {
          //console.log(res.data);
          navigation.navigate("HelperLocation", {
            location: res.data,
          });
        });
    } else {
      console.log("마감시간 한시간 초과");
    }
    //진행상황 보기
  };

  return (
    <View>
      {data.message === "Accept work" ? (
        <CardWrapper>
          <CardTitleWrapper>
            <CardTitle>심부름이 수락되었습니다</CardTitle>
          </CardTitleWrapper>
          {myId !== JSON.parse(chatList.chatList[0].message).customerId ? (
            <CardBtn onPress={onPressWorkComplete}>
              <CardText>일 완료하기</CardText>
            </CardBtn>
          ) : (
            <CardBtn onPress={onPressView}>
              <CardText>진행상황 보기</CardText>
            </CardBtn>
          )}
        </CardWrapper>
      ) : data.message === "Complete work" ? (
        myId !== JSON.parse(chatList.chatList[0].message).customerId ? (
          <CardWrapper>
            <CardTitleWrapper>
              <CardTitle>상대방의 수락 기다리는중</CardTitle>
            </CardTitleWrapper>
            <CardBtn></CardBtn>
          </CardWrapper>
        ) : (
          <CardWrapper>
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
          </CardWrapper>
        )
      ) : data.message === "Finish Work" ? (
        <CardWrapper>
          <CardTitleWrapper>
            <CardTitle>심부름이 종료되었습니다</CardTitle>
          </CardTitleWrapper>
          {myId !== JSON.parse(chatList.chatList[0].message).customerId ? (
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
        </CardWrapper>
      ) : null}
    </View>
  );
};

export default CardChat;
