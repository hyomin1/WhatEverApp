import { Text, View, Pressable, ScrollView } from "react-native";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components/native";
import {
  chatListData,
  chatRoomListData,
  conversationData,
  myIdData,
} from "../atom";
import { useEffect } from "react";

const ChatList = styled.Pressable`
  height: 80px;
  align-items: center;
  flex-direction: row;

  flex-direction: row;
  flex: 1;
  background-color: white;
`;
const ProfileImg = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const ProfileView = styled.View`
  flex: 4;
  height: 80px;
`;
const ProfileName = styled.View`
  margin-top: 10px;
`;

const ProfileText = styled.Text`
  font-size: 17px;
`;
const LastChat = styled.Text`
  color: gray;
`;

const Chat = ({ navigation }) => {
  const [chatList, setChatList] = useRecoilState(chatListData);
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);
  const setConversation = useSetRecoilState(conversationData);
  const myId = useRecoilValue(myIdData);
  console.log(chatRoomList);

  const goChatting = () => {
    navigation.navigate("Stack", { screen: "Chatting" });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "lightgray" }}>
      {chatRoomList.map((data, index) => (
        <ChatList
          key={index}
          onPress={() => {
            goChatting();
            setConversation(data);
            setChatList(data);
            // console.log(data.chatList[0].messageType);
          }}
        >
          <ProfileImg>
            {/**사진 데이터 어디서? aws서버에서 */}
            <Text>사진</Text>
          </ProfileImg>
          <ProfileView>
            <ProfileName>
              {myId === data.creatorId ? (
                <ProfileText>{data.participatorName}</ProfileText>
              ) : (
                <ProfileText>{data.creatorName}</ProfileText>
              )}
            </ProfileName>
            <LastChat>
              {data.chatList[data.chatList.length - 1]?.messageType === "Work"
                ? "심부름 요청서 입니다..."
                : data.chatList[data.chatList.length - 1]?.messageType ===
                  "Card"
                ? "심부름이 수락되었습니다..."
                : data.chatList[data.chatList.length - 1]?.message}
            </LastChat>
          </ProfileView>
        </ChatList>
      ))}
    </ScrollView>
  );
};
export default Chat;
