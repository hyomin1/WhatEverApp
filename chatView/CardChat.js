import { View, Pressable, Text } from "react-native";
import axios from "axios";
import { BASE_URL } from "../api";
import { client } from "../client";
import { useRecoilValue } from "recoil";
import { conversationData } from "../atom";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";

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
  const completeCard = {
    message: "Complete work",
    senderName: myName,
    receiverName: receiverName,
  };

  const onPressWorkComplete = () => {
    client.publish({
      destination: `/pub/card/${conversation._id}`,
      body: JSON.stringify(completeCard),
    });
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
          {data.senderName === myName ? (
            <CardBtn style={{}} onPress={onPressWorkComplete}>
              <CardText>일 완료하기</CardText>
            </CardBtn>
          ) : (
            <CardBtn onPress={onPressView}>
              <CardText>진행상황 보기</CardText>
            </CardBtn>
          )}
        </CardWrapper>
      ) : data.message === "Complete work" ? (
        data.senderName === myName ? (
          <CardWrapper>
            <CardTitleWrapper>
              <CardTitle>상대방의 수락 기다리는중</CardTitle>
            </CardTitleWrapper>
            <CardBtn></CardBtn>
          </CardWrapper>
        ) : (
          <CardWrapper>
            <CardTitleWrapper>
              <CardTitle>심부름 확인</CardTitle>
            </CardTitleWrapper>
            <CardBtn
              onPress={() => {
                axios
                  .put(`${BASE_URL}/api/work/finish/${chatList.workId}`)
                  .then((res) => console.log("afa", res.data));
              }}
            >
              <CardText>확인하기</CardText>
            </CardBtn>
          </CardWrapper>
        )
      ) : null}
    </View>
  );
};

export default CardChat;
