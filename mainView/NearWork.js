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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
const ButtonContainer = styled.View``;
const Button = styled.TouchableOpacity`
  background-color: ${({ bgColor }) => bgColor || "#1e90ff"};
  border-radius: 8px;
  padding: 12px 20px;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ textColor }) => textColor || "#ffffff"};
  text-align: center;
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
  //console.log(nearWork);
  return (
    <ScrollView>
      {nearWork && nearWork.length > 0 ? (
        nearWork.map((data, index) =>
          !data.finished ? (
            <View key={index}>
              <WorkInformation onPress={() => onPressWork(data)} key={index}>
                <View>
                  <WorkTitle>{data.title}</WorkTitle>
                  <WorkSubtitle>마감기한 {data.date}</WorkSubtitle>
                </View>

                {/* 유저 정보보기 버튼 */}
                <ButtonContainer>
                  <Button
                    bgColor="#4CAF50"
                    onPress={() => console.log("유저 정보 보기")}
                  >
                    <ButtonText textColor="#ffffff">유저 정보보기</ButtonText>
                  </Button>
                  {/* 상세보기 버튼 */}
                  <Button
                    bgColor="#1e90ff"
                    onPress={() => console.log("작업 상세보기")}
                  >
                    <ButtonText textColor="#ffffff">심부름 상세보기</ButtonText>
                  </Button>
                </ButtonContainer>
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
    </ScrollView>
  );
};

export default NearWork;
