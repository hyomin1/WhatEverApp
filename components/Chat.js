import { Text, View, Pressable } from "react-native";
import styled from "styled-components/native";

const ChatList = styled.Pressable`
  height: 80px;
  align-items: center;
  flex-direction: row;
  border-bottom-width: 1px;
`;
const ProfileImg = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const ProfileName = styled.View`
  flex: 4;
  justify-content: center;
  align-items: flex-start;
`;
const Chat = ({ navigation }) => {
  const goChatting = () => {
    navigation.navigate("Stack", { screen: "Chatting" });
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ChatList onPress={goChatting}>
        <ProfileImg>
          <Text>사진</Text>
        </ProfileImg>
        <ProfileName>
          <Text>이름</Text>
        </ProfileName>
      </ChatList>
    </View>
  );
};
export default Chat;
