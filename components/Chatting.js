import { View, Text, Alert } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const ChatView = styled.View`
  flex: 9;
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
        <Text>안녕</Text>
        {myMsg.map((msg) => console.log(Date.now()))}
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
