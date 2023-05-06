import { useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components/native";
import {
  ConversationData,
  chatListData,
  chatMsgData,
  chatRoomListData,
} from "../atom";

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
  const [chatList, setChatList] = useRecoilState(chatListData);
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);
  const setConverSation = useSetRecoilState(ConversationData);
  const setChatMsg = useSetRecoilState(chatMsgData);
  const goChatting = () => {
    navigation.navigate("Stack", { screen: "Chatting" });
  };
  //console.log("Chat.js", chatRoomList);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {chatRoomList.map((data, index) => (
        <ChatList
          key={index}
          onPress={() => {
            goChatting();
            setConverSation(data);
            //console.log("챗리스트 안", data);
            setChatList(data);
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
