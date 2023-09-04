import React from "react";
import { Text, View, Pressable, ScrollView, Alert } from "react-native";
import styled from "styled-components/native";
import {
  chatListData,
  chatRoomListData,
  conversationData,
  myIdData,
  workProceedingStatusData,
} from "../atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../api";
import messaging from "@react-native-firebase/messaging";

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
const Badge = styled.View`
  background-color: tomato;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
`;
const BadgeText = styled.Text`
  color: white;
`;

const Chat = () => {
  const navigation = useNavigation();
  const [chatList, setChatList] = useRecoilState(chatListData);
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);
  const setConversation = useSetRecoilState(conversationData);
  const myId = useRecoilValue(myIdData);
  const setWorkStatusCode = useSetRecoilState(workProceedingStatusData);
  const goToChatting = async (chatRoom) => {
    const workId = JSON.parse(chatRoom.chatList[0].message).id;

    setConversation(chatRoom);
    setChatList(chatRoom);
    navigation.navigate("Chatting", { chatRoom }); //수정
    axios
      .post(`http://10.0.2.2:8080/api/conversation/seen/${chatRoom._id}`)
      .then((res) => {
        const newArr = [...chatRoomList];
        chatRoomList.map((data, index) => {
          if (data._id === res.data._id) {
            newArr[index] = res.data;
            setChatRoomList(newArr);
          }
        });
      })
      .catch((error) => {
        console.log("gochatting", error);
        Alert.alert(error);
      });
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
                  {(() => {
                    const lastMessage =
                      chatRoom?.chatList[chatRoom.chatList.length - 1];
                    if (lastMessage?.messageType === "Work") {
                      return "심부름 요청서 입니다";
                    } else if (lastMessage?.messageType === "Card") {
                      if (lastMessage?.message === "Complete work") {
                        return "심부름이 완료되었습니다.";
                      } else if (lastMessage?.message === "Accept work") {
                        return "심부름이 수락되었습니다.";
                      } else {
                        return "기타 Card 메시지입니다.";
                      }
                    } else if (lastMessage?.messageType === "Chat") {
                      return lastMessage?.message;
                    } else {
                      return null;
                    }
                  })()}
                </LastMessage>
              </ProfileInfo>
              {(() => {
                const unseenCount =
                  myId === chatRoom.creatorId
                    ? chatRoom.chatList.length - chatRoom.seenCountByCreator
                    : chatRoom.chatList.length -
                      chatRoom.seenCountByParticipator;
                if (unseenCount > 0) {
                  return (
                    <Badge>
                      <BadgeText>{unseenCount}</BadgeText>
                    </Badge>
                  );
                } else {
                  return null;
                }
              })()}
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
