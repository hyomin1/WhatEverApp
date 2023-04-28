import { View, Text, Alert } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import {
  ConversationData,
  chatListData,
  myIdData,
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
  const [workInform, setWorkInform] = useState();
  const conversation = useRecoilValue(ConversationData);
  const myId = useRecoilValue(myIdData);
  const [myName, setMyName] = useState();
  const [receiverName, setReceiverName] = useState();
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
  //console.log(conversation.workId);
  useEffect(() => {
    axios
      .get(`http://10.0.2.2:8080/api/work/${conversation.workId}`)
      .then((res) => {
        setWorkInform(res.data);
      });

    if (myId === conversation.creatorId) {
      setMyName(conversation.creatorName);
      setReceiverName(conversation.participatorName);
    } else {
      setMyName(conversation.participatorName);
      setReceiverName(conversation.creatorName);
    }
  }, []);
  //console.log(workInform);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ChatView>
        <MyChatWrapper>
          <Text>제목 : {workInform ? workInform.title : null}</Text>
          <Text>내용 : {workInform ? workInform.context : null}</Text>
          <Text>마감시간 : {workInform ? workInform.deadLineTime : null}</Text>
        </MyChatWrapper>

        {myMsg.map((msg, index) => (
          <MyChat key={index}>
            <View style={{ justifyContent: "flex-end" }}>
              <Time>{new Date().toLocaleTimeString()}</Time>
            </View>
            <MyChatWrapper>
              <MyChatText>{msg}</MyChatText>
            </MyChatWrapper>
          </MyChat>
        ))}
      </ChatView>
      <ChatInputView>
        <ChatInput
          value={textInput}
          onChangeText={onChangeMyMsg}
          placeholder="메시지 보내기"
          placeholderTextColor="#D0D3D7"
        />

        <Ionicons onPress={sendMsg} name="md-send" size={24} color="#D0D3D7" />
      </ChatInputView>
    </View>
  );
};
export default Chatting;
