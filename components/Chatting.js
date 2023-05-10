import { View, Text, Alert, Pressable, ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  chatListData,
  myIdData,
  chatRoomListData,
  conversationData,
  receiverNameData,
  workData,
} from "../atom";
import { useEffect } from "react";
import { client } from "../client";
import axios from "axios";

const ChatView = styled.View`
  flex: 9;
  padding-top: 20px;
  margin: 0px 5px;
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
  bottom: 0;
  flex: 1;
`;

const ChatWrapper = styled.View`
  background-color: #0fbcf9;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  padding: 10px 15px;
  margin-bottom: 10px;
`;
const Time = styled.Text`
  font-size: 10px;
  color: #d0d3d7;
  font-weight: 600;
`;
const ChatText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 15px;
`;
const WorkWrapper = styled.View`
  background-color: #0fbcf9;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: auto;
  padding: 10px 15px;
  margin-bottom: 10px;
`;
const WorkBtn = styled.Pressable`
  margin-top: 10px;
  background-color: #2196f3;
  width: 50%;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
`;
const WorkText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 18px;
`;
const WorkAcceptText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 20px;
`;
const Chatting = () => {
  const [textInput, setTextInput] = useState();
  const conversation = useRecoilValue(conversationData);
  const myId = useRecoilValue(myIdData);
  const [myName, setMyName] = useState();
  const [receiverName, setReceiverName] = useRecoilState(receiverNameData);
  const [chatList, setChatList] = useRecoilState(chatListData);
  const chatRoomList = useRecoilValue(chatRoomListData);
  // const work = useRecoilValue(workData);
  const [work, setWork] = useState();

  const chat = {
    senderName: myName,
    receiverName: receiverName,
    message: textInput,
  };

  const sendMsg = () => {
    if (textInput === "") {
      Alert.alert("내용을 입력해주세요");
    } else {
      setTextInput("");
      client.publish({
        destination: `/pub/chat/${conversation._id}`,
        body: JSON.stringify(chat),
      });
    }
  };
  const onChangeMyMsg = (payload) => {
    setTextInput(payload);
  };
  const onPressAccept = () => {
    //console.log("수락");
    //setWork(JSON.parse(chatRoomList[0].chatList[0].message));
    axios
      .put("http://10.0.2.2:8080/api/work/matching", {
        id: JSON.parse(chatRoomList[0].chatList[0].message).id,
        title: JSON.parse(chatRoomList[0].chatList[0].message).title,
        context: JSON.parse(chatRoomList[0].chatList[0].message).context,
        deadLineTime: JSON.parse(chatRoomList[0].chatList[0].message)
          .deadLineTime,
        reward: JSON.parse(chatRoomList[0].chatList[0].message).reward,
        latitude: JSON.parse(chatRoomList[0].chatList[0].message).latitude,
        longitude: JSON.parse(chatRoomList[0].chatList[0].message).longitude,
        proceeding: JSON.parse(chatRoomList[0].chatList[0].message).proceeding,
        customerId: JSON.parse(chatRoomList[0].chatList[0].message).customerId,
        helperId: conversation.participantId,
        finished: JSON.parse(chatRoomList[0].chatList[0].message).finished,
      })
      .then((res) => {
        console.log("수락");
        client.publish({
          destination: `/pub/chat/${conversation._id}`,
          body: JSON.stringify(chatRoomList[0]),
        });
      })
      .catch((error) => console.log(error));
  };
  const onPressDeny = () => {
    console.log("거절");
  };

  useEffect(() => {
    if (myId === conversation.creatorId) {
      setMyName(conversation.creatorName);
      setReceiverName(conversation.participatorName);
    } else {
      setMyName(conversation.participatorName);
      setReceiverName(conversation.creatorName);
    }
  }, []);
  //console.log(conversation.participantId);
  //console.log(chatRoomList[0]);
  useEffect(() => {
    chatRoomList.map((data) => {
      data._id === chatList._id ? setChatList(data) : null;
    });
  }, [chatRoomList]); //chatRoomList 업데이트 마다 chatList 데이터 새롭게 저장
  //console.log(chatRoomList[0].chatList[0].message);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 20 }}>
        <ScrollView>
          <ChatView>
            {chatList
              ? chatList.chatList.map((data, index) =>
                  data.messageType === "Work" ? (
                    <View key={index} style={{ alignItems: "flex-end" }}>
                      <WorkWrapper>
                        <WorkText>
                          제목 : {JSON.parse(data.message).title}
                        </WorkText>
                        <WorkText>
                          내용 : {JSON.parse(data.message).context}
                        </WorkText>
                        <WorkText>
                          마감시간 : {JSON.parse(data.message).deadLineTime}시간
                        </WorkText>
                        <View style={{ flexDirection: "row" }}>
                          <WorkBtn onPress={onPressAccept}>
                            <WorkAcceptText>수락</WorkAcceptText>
                          </WorkBtn>
                          <WorkBtn onPress={onPressDeny}>
                            <WorkAcceptText>거절</WorkAcceptText>
                          </WorkBtn>
                        </View>
                      </WorkWrapper>
                    </View>
                  ) : data.messageType === "Chat" ? (
                    <View key={index}>
                      {data.senderName === myName ? (
                        <View key={index} style={{ alignItems: "flex-end" }}>
                          <ChatWrapper>
                            <ChatText>
                              {data.message ? data.message : null}
                            </ChatText>
                          </ChatWrapper>
                        </View>
                      ) : (
                        <View key={index} style={{ alignItems: "flex-start" }}>
                          <ChatWrapper>
                            <ChatText>{data.message}</ChatText>
                          </ChatWrapper>
                        </View>
                      )}
                    </View>
                  ) : data.messageType === "Card" ? (
                    console.log(index + "Card Message", data.message)
                  ) : null
                )
              : null}
          </ChatView>
        </ScrollView>
      </View>
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
