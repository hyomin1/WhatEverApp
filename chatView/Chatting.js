import { View, Alert, ScrollView } from "react-native";
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
  accessData,
  grantData,
} from "../atom";
import { useEffect } from "react";
import { client } from "../client";
import axios from "axios";
import WorkChat from "./WorkChat";
import NormalChat from "./NormalChat";
import CardChat from "./CardChat";

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

  const chat = {
    senderName: myName,
    receiverName: receiverName,
    message: textInput,
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

  useEffect(() => {
    if (myId === conversation.creatorId) {
      setMyName(conversation.creatorName); //방만듦 고객
      setReceiverName(conversation.participatorName);
    } else {
      setMyName(conversation.participatorName); //헬퍼
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
        <ScrollView style={{ paddingHorizontal: 3 }}>
          <ChatView>
            {chatList
              ? chatList.chatList.map((data, index) =>
                  data.messageType === "Work" ? (
                    <WorkChat
                      key={index}
                      data={data}
                      myName={myName}
                      chatList={chatList}
                      index={index}
                      receiverName={receiverName}
                      creatorId={chatList.creatorId}
                    />
                  ) : data.messageType === "Chat" ? (
                    <NormalChat
                      key={index}
                      myName={myName}
                      data={data}
                      chatList={chatList}
                    />
                  ) : data.messageType === "Card" ? (
                    <CardChat
                      key={index}
                      data={data}
                      myName={myName}
                      chatList={chatList}
                      receiverName={receiverName}
                    />
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
