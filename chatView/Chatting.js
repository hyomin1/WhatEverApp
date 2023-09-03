import React, { useState, useEffect } from "react";
import { View, ScrollView, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chatListData,
  myIdData,
  chatRoomListData,
  conversationData,
  receiverNameData,
  accessData,
  grantData,
  workProceedingStatusData,
} from "../atom";
import { client } from "../client";
import axios from "axios";
import WorkChat from "./WorkChat";
import NormalChat from "./NormalChat";
import CardChat from "./CardChat";
import { BASE_URL } from "../api";

const Container = styled.View`
  flex: 1;
  background-color: #e0e0e0;
`;

const ChatView = styled.ScrollView`
  flex: 1;
  padding: 20px 5px;
`;

const ChatInputView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #f2f3f6;
`;

const ChatInput = styled.TextInput`
  flex: 1;
  height: 45px;
  border-radius: 15px;
  padding: 0px 15px;
  background-color: #fff;
  font-size: 15px;
  font-weight: 600;
  margin-right: 10px;
`;

const SendButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #2196f3;
  align-items: center;
  justify-content: center;
`;

const SendIcon = styled(Ionicons)`
  color: white;
`;

const Chatting = ({ route }) => {
  const [textInput, setTextInput] = useState("");

  const myId = useRecoilValue(myIdData);
  const [myName, setMyName] = useState("");
  const [receiverName, setReceiverName] = useRecoilState(receiverNameData);
  const [chatList, setChatList] = useRecoilState(chatListData);
  const chatRoomList = useRecoilValue(chatRoomListData);
  const access = useRecoilValue(accessData);
  const grant = useRecoilValue(grantData);
  const setWorkStatusCode = useSetRecoilState(workProceedingStatusData);

  const chat = {
    senderName: myName,
    receiverName: receiverName,
    message: textInput,
  };

  const fetchData = async () => {
    if (chatList.workId !== null) {
      try {
        const res = await axios.get(`${BASE_URL}/api/work/${chatList.workId}`);
        setWorkStatusCode(res.data.workProceedingStatus);
      } catch (error) {
        console.log("is", error);
      }
    } else {
      setWorkStatusCode(0);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const sendMsg = () => {
    if (textInput === "") {
      Alert.alert("내용을 입력해주세요");
    } else {
      setTextInput("");
      client.publish({
        destination: `/pub/chat/${chatList._id}`,
        body: JSON.stringify(chat),
        headers: { Authorization: `${grant} ${access}` },
      });
      axios
        .post(`http://10.0.2.2:8080/api/fcm/chatNotification/${chatList._id}`)
        .then((res) => {})
        .catch((error) => console.log("fcmerr", error));
    }
  };

  const onChangeMyMsg = (payload) => {
    setTextInput(payload);
  };

  useEffect(() => {
    if (myId === chatList.creatorId) {
      setMyName(chatList.creatorName);
      setReceiverName(chatList.participatorName);
    } else {
      setMyName(chatList.participatorName);
      setReceiverName(chatList.creatorName);
    }
  }, []);

  useEffect(() => {
    const updatedChatList = chatRoomList.find(
      (room) => room._id === chatList._id
    );
    if (updatedChatList) {
      setChatList(updatedChatList);
    }
  }, [chatRoomList]);

  const chatListItems = chatList?.chatList || [];
  return (
    <Container>
      <ScrollView>
        <ChatView>
          {chatListItems.map((data, index) =>
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
          )}
        </ChatView>
      </ScrollView>
      <ChatInputView>
        <ChatInput
          value={textInput}
          onChangeText={onChangeMyMsg}
          placeholder="메시지 보내기"
          placeholderTextColor="#D0D3D7"
        />
        <SendButton onPress={sendMsg}>
          <SendIcon name="md-send" size={24} />
        </SendButton>
      </ChatInputView>
    </Container>
  );
};

export default Chatting;
