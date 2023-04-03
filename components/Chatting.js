import { View, Text, Alert } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

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
  const sendMsg = () => {
    setMyMsg([...myMsg, textInput]);
    setTextInput("");
  };
  const onChangeMyMsg = (payload) => {
    setTextInput(payload);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ChatView>
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
