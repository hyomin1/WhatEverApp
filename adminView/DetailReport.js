import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRecoilValue } from "recoil";
import styled from "styled-components/native";
import { BASE_URL } from "../api";
import { adminTokenData } from "../atom";
import HandleReport from "./HandleReport";

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
`;

const ReportContainer = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const Content = styled.Text`
  font-size: 16px;
  margin-top: 20px;
  color: #888;
`;
const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 10px;
`;
const Button = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
  width: 40%;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  text-align: center;
`;

const DetailReport = ({ route }) => {
  const report = route.params.report;
  //const isHleper  추가해서 HandleReport 에 보내고 isHelper true 이면 환불 빼기

  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const adminToken = useRecoilValue(adminTokenData);

  const onViewConversation = async () => {
    const token = await AsyncStorage.getItem("adminToken");
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/conversation/${report.conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigation.navigate("AdminConversationView", {
        chatList: res.data,
        report,
      });
    } catch (error) {
      console.log(error);
      Alert.alert(error.response.data.message);
    }
  };
  const onViewWork = async () => {
    try {
      const token = await AsyncStorage.getItem("adminToken");
      const res = await axios.get(`${BASE_URL}/admin/work/${report.workId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigation.navigate("AdminWorkView", {
        work: res.data,
      });
    } catch (error) {
      console.log(error);
      Alert.alert(error.response.data.message);
    }
  };
  const onViewUser = async (userId) => {
    try {
      const token = await AsyncStorage.getItem("adminToken");
      const res = await axios.get(`${BASE_URL}/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigation.navigate("AdminUserView", {
        user: res.data,
      });
      //신고자 피신고자 id만 다르게 넣으면 구분가능
    } catch (error) {
      console.log(error);
      Alert.alert(error.response.data.message);
    }
  };

  return (
    <Container>
      <ReportContainer>
        <Title> {report.reportTitle}</Title>
        <Content>{report.reportReason}</Content>
      </ReportContainer>
      <ButtonContainer>
        <Button onPress={onViewConversation}>
          <ButtonText>대화 내역 보기</ButtonText>
        </Button>

        <Button onPress={onViewWork}>
          <ButtonText>심부름 상세 보기</ButtonText>
        </Button>
      </ButtonContainer>
      <ButtonContainer>
        <Button onPress={() => onViewUser(report.reportUserId)}>
          <ButtonText>신고자 정보 보기</ButtonText>
        </Button>
        <Button onPress={() => onViewUser(report.reportedUserId)}>
          <ButtonText>피신고자 정보 보기</ButtonText>
        </Button>
      </ButtonContainer>
      <ButtonContainer>
        <Button onPress={() => setModalVisible(true)}>
          <ButtonText>신고내역 처리하기</ButtonText>
        </Button>
      </ButtonContainer>

      <HandleReport
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        report={report}
      />
    </Container>
  );
};

export default DetailReport;
