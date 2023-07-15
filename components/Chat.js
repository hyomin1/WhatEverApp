import { Text, View, Pressable, ScrollView } from "react-native";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components/native";
import {
  chatListData,
  chatRoomListData,
  conversationData,
  myIdData,
} from "../atom";

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
          }}
        >
          <ProfileImg>
            {/**사진 데이터 어디서? */}
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
            <LastChat>안녕하세요, 심부름 문의 입니다.</LastChat>
          </ProfileView>
        </ChatList>
      ))}
    </ScrollView>
  );
};
export default Chat;
