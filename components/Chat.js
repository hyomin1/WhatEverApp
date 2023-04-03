import { Text, View } from "react-native";
import styled from "styled-components/native";

const ChatList = styled.View`
  border-bottom: 1px black solid;
`;

const Chat = () => {
  return (
    <View>
      <ChatList>
        <Text>Chat</Text>
      </ChatList>
    </View>
  );
};
export default Chat;
