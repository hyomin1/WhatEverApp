import React from "react";
import { Text, View, Pressable, ScrollView } from "react-native";
import styled from "styled-components/native";
import {
  chatListData,
  chatRoomListData,
  conversationData,
  myIdData,
} from "../atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const ChatList = styled.TouchableOpacity`
  background-color: white;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
`;

const ProfileImage = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #ddd;
  justify-content: center;
  align-items: center;
`;

const ProfileInfo = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const Username = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const LastMessage = styled.Text`
  font-size: 14px;
  color: #777;
  margin-top: 5px;
`;

const Chat = () => {
  const navigation = useNavigation();
  const [chatList, setChatList] = useRecoilState(chatListData);
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);
  const setConversation = useSetRecoilState(conversationData);
  const myId = useRecoilValue(myIdData);

  const goToChatting = (chatRoom) => {
    navigation.navigate("Chatting", { chatRoom });
    setConversation(chatRoom);
    setChatList(chatRoom);
  };

  return (
    <Container>
      <ScrollView>
        {chatRoomList.length !== 0 ? (
          chatRoomList.map((chatRoom, index) => (
            <ChatList
              key={index}
              activeOpacity={0.8}
              onPress={() => goToChatting(chatRoom)}
            >
              <ProfileImage>
                {/* 사진 데이터 어디서? aws서버에서 */}
                <Text>사진</Text>
              </ProfileImage>
              <ProfileInfo>
                <Username>
                  {myId === chatRoom.creatorId
                    ? chatRoom.participatorName
                    : chatRoom.creatorName}
                </Username>
                <LastMessage>
                  {chatRoom.chatList[chatRoom.chatList.length - 1]
                    ?.messageType === "Work"
                    ? "심부름 요청서 입니다..."
                    : chatRoom.chatList[chatRoom.chatList.length - 1]
                        ?.messageType === "Card"
                    ? "심부름이 수락되었습니다..."
                    : chatRoom.chatList[chatRoom.chatList.length - 1]?.message}
                </LastMessage>
              </ProfileInfo>
            </ChatList>
          ))
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#666", marginTop: 10 }}>
              채팅방이 없습니다
            </Text>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default Chat;
