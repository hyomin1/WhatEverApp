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
import { BASE_URL } from "../api";

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
const ChatWrapper2 = styled(ChatWrapper)`
  background-color: #dcdde1;
`;
const ChatText = styled.Text`
  color: white;
  font-size: 17px;
`;
const ChatText2 = styled(ChatText)`
  color: black;
`;
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
const CardWrapper = styled(WorkWrapper)`
  height: 100px;
  width: 200px;
`;
const CardTitleWrapper = styled(WorkTitleWrapper)``;
const CardTitle = styled(WorkTitle)``;
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
const Time = styled.Text`
  color: gray;
  margin-top: 5px;
  font-size: 12px;
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

  const chat = {
    senderName: myName,
    receiverName: receiverName,
    message: textInput,
  };
  const AcceptCard = {
    message: "Accept work",
    senderName: myName,
    receiverName: receiverName,
  };
  const CompleteCard = {
    message: "Complete work",
    senderName: myName,
    receiverName: receiverName,
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
        .post(`${BASE_URL}/api/location/helperLocation/${id}`, {
          latitude: latitude,
          longitude: longitude,
        })
        .then((res) => {
          console.log("위치데이터", res.data);
        })
        .catch((error) => console.log(error));
    }, 10000);
  };

  const onPressAccept = (index) => {
    const work = JSON.parse(chatList.chatList[index].message);
    console.log(work);
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
        console.log(res.data);

        client.publish({
          destination: `/pub/card/${conversation._id}`,
          body: JSON.stringify(AcceptCard),
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
    client.publish({
      destination: `/pub/card/${conversation._id}`,
      body: JSON.stringify(CompleteCard),
    });
  };
  console.log(chatList);
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

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 20 }}>
        <ScrollView>
          <ChatView>
            {chatList
              ? chatList.chatList.map((data, index) =>
                  data.messageType === "Work" ? (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent:
                          data.senderName === myName
                            ? "flex-end"
                            : "flex-start",
                      }}
                    >
                      {/*<Time>{data.sendTime.slice(0, 16)}</Time>*/}
                      <WorkWrapper>
                        <WorkTitleWrapper>
                          <WorkTitle>심부름 요청서</WorkTitle>
                        </WorkTitleWrapper>
                        <WorkTextView>
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
                        </WorkTextView>
                        {myId === chatList.participantId ? (
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            <WorkBtn onPress={() => onPressAccept(index)}>
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
                        <View
                          key={index}
                          style={{
                            justifyContent: "flex-end",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Time style={{ marginRight: 5 }}>
                            {data.sendTime.slice(0, 10)}{" "}
                            {data.sendTime.slice(11, 16)}
                          </Time>
                          <ChatWrapper>
                            <ChatText>
                              {data.message ? data.message : null}
                            </ChatText>
                          </ChatWrapper>
                        </View>
                      ) : (
                        <View
                          key={index}
                          style={{
                            justifyContent: "flex-start",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <ChatWrapper2>
                            <ChatText2>{data.message}</ChatText2>
                          </ChatWrapper2>
                          <Time style={{ marginLeft: 5 }}>
                            {data.sendTime.slice(0, 10)}{" "}
                            {data.sendTime.slice(11, 16)}
                          </Time>
                        </View>
                      )}
                    </View>
                  ) : data.messageType === "Card" ? (
                    data.message === "Accept work" ? (
                      <CardWrapper key={index}>
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
                        <Pressable>
                          <Text>대기중</Text>
                        </Pressable>
                      ) : (
                        <Pressable
                          onPress={() => {
                            axios
                              .put(
                                `${BASE_URL}/api/work/finish/${chatList.workId}`
                              )
                              .then((res) => console.log("afa", res.data));
                          }}
                        >
                          <Text>확인하기</Text>
                        </Pressable>
                      )
                    ) : null
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
