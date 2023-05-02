import { View, Text, Alert, Pressable, ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import {
  ConversationData,
  chatListData,
  myIdData,
  recvMsgData,
  workChatData,
} from "../atom";
import { useEffect } from "react";
import { apiClient } from "../api";
import axios from "axios";
import { client } from "../client";

const ChatView = styled.View`
  flex: 9;
  padding-top: 20px;
  align-items: flex-end;
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
`;
const MyChat = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 20px;
  margin-bottom: 10px;
  width: 80%;
`;
const MyChatWrapper = styled.View`
  background-color: #0fbcf9;
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
const MyChatText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 15px;
`;
const Chatting = () => {
  const [myMsg, setMyMsg] = useState([]);
  const [textInput, setTextInput] = useState();
  const conversation = useRecoilValue(ConversationData);
  const myId = useRecoilValue(myIdData);
  const [myName, setMyName] = useState();
  const [receiverName, setReceiverName] = useState();
  const recvMsg = useRecoilValue(recvMsgData);

  const [chatMsg, setChatMsg] = useState();

  const chat = {
    senderName: myName,
    receiverName: receiverName,
    message: textInput,
  };

  const sendMsg = () => {
    setMyMsg([...myMsg, textInput]);
    setTextInput("");
    //console.log(textInput);
    client.publish({
      destination: `/pub/chat/${conversation._id}`,
      body: JSON.stringify(chat),
    });
  };
  const onChangeMyMsg = (payload) => {
    setTextInput(payload);
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

  console.log("!!!!!!!!!!!!!!!!!!!", JSON.parse(recvMsg));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <ChatView></ChatView>
      <View></View>
      <ChatInputView>
        <ChatInput
          value={textInput}
          onChangeText={onChangeMyMsg}
          placeholder="메시지 보내기"
          placeholderTextColor="#D0D3D7"
        />

        <Ionicons onPress={sendMsg} name="md-send" size={24} color="#D0D3D7" />
      </ChatInputView>
    </ScrollView>
  );
};
export default Chatting;
