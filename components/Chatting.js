import { View, Text, Alert, Pressable, ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  chatListData,
  myIdData,
  chatRoomListData,
  conversationData,
  receiverNameData,
  workListData,
  helperLocationData,
  accessData,
  grantData,
} from "../atom";
import { useEffect } from "react";
import { client } from "../client";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import BackgroundTimer from "react-native-background-timer";

const ChatView = styled.View`
  flex: 9;
  padding-top: 20px;
  margin: 0px 5px;
`;
const ChatInputView = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;
const ChatInput = styled.TextInput`
  height: 45px;
  border-radius: 15px;
  padding: 0px 15px;
  width: 80%;
  margin-right: 20px;
  background-color: #f2f3f6;
  font-size: 15px;
  font-weight: 600;
  bottom: 0;
  flex: 1;
`;

const ChatWrapper = styled.View`
  background-color: #0fbcf9;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  padding: 10px 15px;
  margin-bottom: 10px;
`;
const ChatWrapper2 = styled.View`
  background-color: white;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  padding: 10px 15px;
  margin-bottom: 10px;
`;
const Time = styled.Text`
  font-size: 10px;
  color: #d0d3d7;
  font-weight: 600;
`;
const ChatText = styled.Text`
  color: black;
  font-weight: 700;
  font-size: 17px;
`;
const WorkWrapper = styled.View`
  background-color: white;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 300px;
  //padding: 10px 0px;
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
const CardWrapper = styled.View`
  flex: 1;
  background-color: white;
  border-radius: 15px;
  align-items: center;
  justify-content: space-between;
  width: 250px;
  height: 300px;
  margin-bottom: 10px;
`;
const CardTitle = styled.Text`
  color: black;
  font-weight: 600;
  font-size: 18px;
  background-color: #0fbcf9;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  width: 250px;
  height: 90px;
  padding-left: 10px;
  padding-top: 20px;
`;
const CardText = styled.Text`
  background-color: lightgray;
  width: 180px;
  text-align: center;
  height: 40px;
  border-radius: 10px;
`;
const Chatting = () => {
  const [textInput, setTextInput] = useState();
  const conversation = useRecoilValue(conversationData);
  const myId = useRecoilValue(myIdData);
  const [myName, setMyName] = useState();
  const [receiverName, setReceiverName] = useRecoilState(receiverNameData);
  const [chatList, setChatList] = useRecoilState(chatListData);
  const chatRoomList = useRecoilValue(chatRoomListData);
  const [ok, setOk] = useState();

  const access = useRecoilValue(accessData);
  const grant = useRecoilValue(grantData);

  const navigation = useNavigation();

  const workList = useRecoilValue(workListData);
  const [helperLocation, setHelperLocation] =
    useRecoilState(helperLocationData);

  const chat = {
    senderName: myName,
    receiverName: receiverName,
    message: textInput,
  };
  const card = {
    message: "Accept work",
  };

  const sendMsg = () => {
    if (textInput === "") {
      Alert.alert("내용을 입력해주세요");
    } else {
      setTextInput("");
      client.publish({
        destination: `/pub/chat/${conversation._id}`,
        body: JSON.stringify(chat),
        headers: { Authorization: `${grant}` + " " + `${access}` },
      });
      axios
        .post(`http://10.0.2.2:8080/api/fcm/${conversation._id}`)
        .then((res) => {
          console.log("fcm alarm", res.data);
        })
        .catch((error) => console.log("fcmerr", error));
    }
  };
  const onChangeMyMsg = (payload) => {
    setTextInput(payload);
  };

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
        .post(`http://10.0.2.2:8080/api/location/helperLocation/${id}`, {
          latitude: latitude,
          longitude: longitude,
        })
        .then((res) => {
          console.log("위치데이터", res.data);
        })
        .catch((error) => console.log(error));
    }, 5000);
  };

  const onPressAccept = () => {
    const work = JSON.parse(chatList.chatList[0].message);
    axios
      .put("http://10.0.2.2:8080/api/work/matching", {
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
        console.log("수락");
        client.publish({
          destination: `/pub/card/${conversation._id}`,
          body: JSON.stringify(card),
        });

        if (work.deadLineTime === 1) {
          intervalId(work.id);
        }
      })
      .catch((error) => console.log("accept", error));
  };
  const onPressDeny = () => {
    if (chatList.participatorName === myName) {
      Alert.alert("거절되었습니다.");
    }
  };
  const onPressWorkComplete = () => {
    console.log("일 완료");
  };
  const onPressView = () => {
    console.log("진행 상황 보기");
    if (JSON.parse(chatList.chatList[0].message).deadLineTime === 1) {
      console.log("마감시간 한시간");
      axios
        .get(
          `http://10.0.2.2:8080/api/location/helperLocation/${
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
  //console.log(chatList);

  useEffect(() => {
    if (myId === conversation.creatorId) {
      setMyName(conversation.creatorName);
      setReceiverName(conversation.participatorName);
    } else {
      setMyName(conversation.participatorName);
      setReceiverName(conversation.creatorName);
    }
  }, []);

  useEffect(() => {
    chatRoomList.map((data) => {
      data._id === chatList._id ? setChatList(data) : null;
    });
  }, [chatRoomList]); //chatRoomList 업데이트 마다 chatList 데이터 새롭게 저장

  console.log(myId);
  return (
    <View style={{ flex: 1, backgroundColor: "lightgray" }}>
      <View style={{ flex: 20 }}>
        <ScrollView>
          <ChatView>
            {chatList
              ? chatList.chatList.map((data, index) =>
                  data.messageType === "Work" ? (
                    <View
                      key={index}
                      style={{
                        alignItems:
                          data.senderName === myName
                            ? "flex-end"
                            : "flex-start",
                      }}
                    >
                      <WorkWrapper>
                        <WorkTitleWrapper>
                          <WorkTitle>심부름 요청서</WorkTitle>
                        </WorkTitleWrapper>
                        <View
                          style={{
                            flex: 5,
                            paddingTop: 10,
                          }}
                        >
                          <WorkText>
                            제목 : {JSON.parse(data.message).title}
                          </WorkText>
                          <WorkText>
                            내용 : {JSON.parse(data.message).context}
                          </WorkText>
                          <WorkText>
                            마감시간 : {JSON.parse(data.message).deadLineTime}
                            시간
                          </WorkText>
                        </View>
                        {myId === chatList.participantId ? (
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            <WorkBtn onPress={onPressAccept}>
                              <WorkAcceptText>수락</WorkAcceptText>
                            </WorkBtn>
                            <WorkBtn onPress={onPressDeny}>
                              <WorkAcceptText>거절</WorkAcceptText>
                            </WorkBtn>
                          </View>
                        ) : null}
                      </WorkWrapper>
                    </View>
                  ) : data.messageType === "Chat" ? (
                    <View key={index}>
                      {data.senderName === myName ? (
                        <View key={index} style={{ alignItems: "flex-end" }}>
                          <ChatWrapper>
                            <ChatText>
                              {data.message ? data.message : null}
                            </ChatText>
                          </ChatWrapper>
                        </View>
                      ) : (
                        <View key={index} style={{ alignItems: "flex-start" }}>
                          <ChatWrapper2>
                            <ChatText>{data.message}</ChatText>
                          </ChatWrapper2>
                        </View>
                      )}
                    </View>
                  ) : data.messageType === "Card" ? (
                    <CardWrapper key={index}>
                      <CardTitle>심부름 수락했어요</CardTitle>
                      {myId === chatList.participantId ? (
                        <Pressable
                          style={{
                            flex: 1,
                            justifyContent: "flex-end",
                            marginBottom: 10,
                            backgroundColor: "lightgray",
                          }}
                          onPress={onPressWorkComplete}
                        >
                          <CardText>일 완료하기</CardText>
                        </Pressable>
                      ) : (
                        <Pressable
                          style={{
                            flex: 1,
                            justifyContent: "flex-end",
                            marginBottom: 10,
                            backgroundColor: "lightgray",
                          }}
                          onPress={onPressView}
                        >
                          <CardText>진행상황 보기</CardText>
                        </Pressable>
                      )}
                    </CardWrapper>
                  ) : null
                )
              : null}
          </ChatView>
        </ScrollView>
      </View>
      <ChatInputView>
        <ChatInput
          value={textInput}
          onChangeText={onChangeMyMsg}
          placeholder="메시지 보내기"
          r
          placeholderTextColor="#D0D3D7"
        />
        <Ionicons onPress={sendMsg} name="md-send" size={24} color="#D0D3D7" />
      </ChatInputView>
    </View>
  );
};
export default Chatting;
