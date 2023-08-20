import React, { useState } from "react";
import { View, Text, Modal, Pressable, ScrollView } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  accessData,
  chatListData,
  chatRoomListData,
  conversationData,
} from "../atom";
import axios from "axios";
import { BASE_URL } from "../api";
import { client } from "../client";

const Wrapper = styled.View`
  flex: 1;
`;

const HeaderView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
`;

const Title = styled.Text`
  font-weight: 600;
  font-size: 18px;
`;

const WorkInformation = styled.Pressable`
  margin: 15px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
`;

const WorkTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #333333;
`;

const WorkSubtitle = styled.Text`
  font-size: 14px;
  color: #999999;
  margin-top: 5px;
`;

const WorkDetail = styled.View`
  margin: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
`;

const WorkDetailTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 10px;
`;

const WorkDetailContent = styled.Text`
  font-size: 14px;
  color: #555555;
`;

const ProgressButton = styled.Pressable`
  background-color: #1e90ff;
  border-radius: 8px;
  padding: 12px 20px;
  margin-top: 20px;
`;

const ProgressButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
`;

const NearWork = ({ nearWork }) => {
  const [visible, setVisible] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const navigation = useNavigation();
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);
  const [chatList, setChatList] = useRecoilState(chatListData);
  const [conversation, setConversation] = useRecoilState(conversationData);
  const accessToken = useRecoilValue(accessData);

  const onPressWork = (work) => {
    setSelectedWork(work);
    setVisible(true);
  };
  //console.log(nearWork);
  const onPressProgress = (data) => {
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
        navigation.navigate("Chatting");
      })
      .catch((error) => console.log("1", error.response.data.message));
    // 진행 요청 로직
  };

  return (
    <ScrollView>
      {nearWork && nearWork.length > 0 ? (
        nearWork.map((data, index) =>
          !data.finished ? (
            <View key={index}>
              <WorkInformation onPress={() => onPressWork(data)} key={index}>
                <WorkTitle>{data.title}</WorkTitle>
                <WorkSubtitle>작성자: {data.author}</WorkSubtitle>
                <WorkSubtitle>작성일: {data.date}</WorkSubtitle>
              </WorkInformation>
            </View>
          ) : null
        )
      ) : (
        <View
          style={{
            flex: 1,
            marginTop: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>주변에 심부름이 없습니다</Text>
        </View>
      )}

      <Modal animationType="slide" visible={visible}>
        <Wrapper>
          <HeaderView>
            <Pressable onPress={() => setVisible(false)}>
              <MaterialIcons name="cancel" size={24} color="black" />
            </Pressable>
            <Title>상세보기</Title>
            <View />
          </HeaderView>
          {selectedWork && (
            <WorkDetail>
              <WorkDetailTitle>제목</WorkDetailTitle>
              <WorkDetailContent>{selectedWork.title}</WorkDetailContent>
              <WorkDetailTitle>작성자</WorkDetailTitle>
              <WorkDetailContent>{selectedWork.author}</WorkDetailContent>
              <WorkDetailTitle>작성일</WorkDetailTitle>
              <WorkDetailContent>{selectedWork.date}</WorkDetailContent>
              <WorkDetailTitle>상세 내용</WorkDetailTitle>
              <WorkDetailContent>{selectedWork.context}</WorkDetailContent>
              <ProgressButton onPress={() => onPressProgress(selectedWork)}>
                <ProgressButtonText>진행 요청</ProgressButtonText>
              </ProgressButton>
            </WorkDetail>
          )}
        </Wrapper>
      </Modal>
    </ScrollView>
  );
};

export default NearWork;
