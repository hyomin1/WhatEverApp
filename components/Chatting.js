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
} from "../atom";
import { useEffect } from "react";
import { client } from "../client";

const ChatView = styled.View`
  flex: 9;
  padding-top: 20px;
  align-items: flex-end;
  margin-right: 5px;
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
const Time = styled.Text`
  font-size: 10px;
  color: #d0d3d7;
  font-weight: 600;
`;
const ChatText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 15px;
`;
const WorkWrapper = styled.View`
  background-color: #0fbcf9;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: auto;
  padding: 10px 15px;
  margin-bottom: 10px;
`;
const WorkBtn = styled.Pressable`
  margin-top: 10px;
  background-color: #2196f3;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const WorkText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 18px;
`;
const WorkAcceptText = styled.Text`
  color: white;
  font=weight: 600;
  font-size: 20px;
`;
const Chatting = () => {
  const [textInput, setTextInput] = useState();
  const conversation = useRecoilValue(conversationData);
  const myId = useRecoilValue(myIdData);
  const [myName, setMyName] = useState();
  const [receiverName, setReceiverName] = useState();
  const [chatList, setChatList] = useRecoilState(chatListData);
  const chatRoomList = useRecoilValue(chatRoomListData);

  const chat = {
    senderName: myName,
    receiverName: receiverName,
    message: textInput,
  };

  const sendMsg = () => {
    setTextInput("");
    client.publish({
      destination: `/pub/chat/${conversation._id}`,
      body: JSON.stringify(chat),
    });
  };
  const onChangeMyMsg = (payload) => {
    console.log("빈값", payload);
    payload ? setTextInput(payload) : null;
    //setTextInput(payload);
  };
  const onPressAccept = () => {
    console.log("수락");
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
                    <WorkWrapper key={index}>
                      <WorkText>
                        제목 : {JSON.parse(data.message).title}
                      </WorkText>
                      <WorkText>
                        내용 : {JSON.parse(data.message).context}
                      </WorkText>
                      <WorkText>
                        마감시간 : {JSON.parse(data.message).deadLineTime}시간
                      </WorkText>
                      <WorkBtn onPress={onPressAccept}>
                        <WorkAcceptText>수락하기</WorkAcceptText>
                      </WorkBtn>
                    </WorkWrapper>
                  ) : data.messageType === "Chat" ? (
                    <ChatWrapper key={index}>
                      <ChatText>{data.message ? data.message : null}</ChatText>
                    </ChatWrapper>
                  ) : data.messageType === "Card" ? (
                    console.log(index + "Card Message", data.message)
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
          placeholderTextColor="#D0D3D7"
        />
        <Ionicons onPress={sendMsg} name="md-send" size={24} color="#D0D3D7" />
      </ChatInputView>
    </View>
  );
};
export default Chatting;
