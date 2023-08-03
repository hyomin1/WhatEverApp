import axios from "axios";
import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";
import styled from "styled-components/native";
import { BASE_URL } from "../api";
import { useNavigation } from "@react-navigation/native";
import { client } from "../client";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  accessData,
  chatListData,
  chatRoomListData,
  conversationData,
  grantData,
} from "../atom";

const WorkInformation = styled.Pressable`
  margin-top: 15px;
  flex: 1;
  background-color: white;
  border-radius: 20px;
  padding: 20px 20px;
`;

const WorkText = styled.Text`
  font-size: 17px;
  margin-bottom: 10px;
  font-weight: 600;
  color: #7f8fa6;
`;

const NearWork = ({ nearWork }) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);
  const [chatList, setChatList] = useRecoilState(chatListData);
  const [conversation, setConversation] = useRecoilState(conversationData);
  const accessToken = useRecoilValue(accessData);
  const onPressWork = () => {
    setVisible((cur) => !cur);
  };
  const goChat = () => {
    navigation.navigate("Chatting");
  };

  const onPressProgress = (data) => {
    console.log("진행요청");
    axios
      .post(`${BASE_URL}/api/conversation/${data.customerId}`, {
        id: data.id,
      })
      .then((res) => {
        setConversation(res.data);
        setChatRoomList([...chatRoomList, res.data]);
        setChatList(res.data);
        client.publish({
          destination: `/pub/work/${res.data._id}`,
          body: JSON.stringify(data),
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        goChat();
      });
  };
  return (
    <ScrollView>
      {nearWork
        ? nearWork.map((data, index) => (
            <View key={index}>
              <WorkInformation onPress={onPressWork} key={index}>
                <WorkText>제목 : {data.title}</WorkText>
              </WorkInformation>
              <Modal
                style={{ flex: 1 }}
                animationType="slide"
                visible={visible}
              >
                <Pressable onPress={() => setVisible((cur) => !cur)}>
                  <WorkText>{data.context}</WorkText>
                </Pressable>
                <Pressable onPress={() => onPressProgress(data)}>
                  <WorkText>진행 요청</WorkText>
                </Pressable>
              </Modal>
            </View>
          ))
        : null}
    </ScrollView>
  );
};

export default NearWork;
