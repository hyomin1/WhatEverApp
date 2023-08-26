import { View, Alert } from "react-native";
import axios from "axios";
import { BASE_URL } from "../api";
import { client } from "../client";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  accessData,
  chatRoomListData,
  conversationData,
  isTimerData,
  myIdData,
  workStatusCodeData,
} from "../atom";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";

import * as Location from "expo-location";
import { Text } from "react-native";
const CardContiainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`;
const CardBubble = styled.View`
  background-color: white;
  border-radius: 10px;
  margin: 5px;
  width: 50%;
  margin-bottom: 30px;
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
const Time = styled.Text`
  color: gray;
  margin-bottom: 30px;
  font-size: 12px;
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
  const messageData = JSON.parse(chatList.chatList[0].message);
  const setChatRoomList = useSetRecoilState(chatRoomListData);
  const [workStatusCode, setWorkStatusCode] =
    useRecoilState(workStatusCodeData);
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
      .then(({ data }) => {
        client.publish({
          destination: `/pub/card/${conversation._id}`,
          body: JSON.stringify(completeCard),
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        axios.post(`${BASE_URL}/api/fcm/${conversation._id}`).then();

        setWorkStatusCode(data.workProceedingStatus);
      })
      .catch((error) => {
        Alert.alert(error.response.data.message);
      });

    isSetTimer(false);
  };

  const onPressView = () => {
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
                axios.post(`${BASE_URL}/api/fcm/${conversation._id}`).then();
                axios.get(`${BASE_URL}/api/conversations`).then(({ data }) => {
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
          <Time>
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
              {
                //workStatusCode === 1 ? (
                <ButtonContainer>
                  <ActionButton
                    onPress={isCustomer ? onPressView : onPressWorkComplete}
                  >
                    <ButtonText>
                      {isCustomer ? "진행상황 보기" : "심부름 완료하기"}
                    </ButtonText>
                  </ActionButton>
                </ButtonContainer>
                // ) : null
              }
            </PaddingView>
            <Divider />
          </CardBubble>
        </CardContiainer>
      ) : data.message === "Complete work" ? (
        myId !== messageData.customerId ? (
          <CardContiainer>
            <Time>
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
          <CardContiainer>
            <Time>
              {data.sendTime
                ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(11, 16)}`
                : null}
            </Time>
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
          </CardContiainer>
        )
      ) : // ) : data.message === "Finish Work" ? (
      //   <CardContainer>
      //     <CardTitle>심부름 종료</CardTitle>
      //     <Divider />
      //     {
      //       myId !== messageData.customerId ? (
      //         <ButtonContainer>
      //           <ActionButton>
      //             <ButtonText>헬퍼 입장 종료</ButtonText>
      //           </ActionButton>
      //         </ButtonContainer>
      //       ) : null
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

      //</View>/ </CardContainer>
      null}
    </View>
  );
};

export default CardChat;
