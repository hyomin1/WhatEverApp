import { Text, View, Pressable } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components/native";
import { ConversationData, chatListData } from "../atom";

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
  const chatList = useRecoilValue(chatListData);
  const setConverSation = useSetRecoilState(ConversationData);
  const goChatting = () => {
    navigation.navigate("Stack", { screen: "Chatting" });
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {chatList.map((data, index) => (
        <ChatList
          key={index}
          onPress={() => {
            goChatting();
            setConverSation(data);
          }}
        >
          <ProfileImg>
            <Text>사진</Text>
          </ProfileImg>
          <ProfileName>
            <Text>{data.participatorName}</Text>
          </ProfileName>
        </ChatList>
      ))}
    </View>
  );
};
export default Chat;
