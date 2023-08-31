import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import styled from "styled-components/native";
import { BASE_URL } from "../api";
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
  margin-top: 10px;
`;

const Button = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  text-align: center;
`;

const DetailReport = ({ route }) => {
  const temp = route.params.temp;
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const onViewConversation = async () => {
    navigation.navigate("AdminConversationView");
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/conversation/${convid}`
      );
    } catch (error) {
      console.log(error);

      //Alert.alert(error.response.data.message);
    }
  };
  const onViewWork = async () => {
    navigation.navigate("AdminWorkView");
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/work/${workid}`);
    } catch (error) {
      console.log(error);
      //Alert.alert(error.response.data.message);
    }
  };
  const onViewUser = async () => {
    navigation.navigate("AdminUserView");
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/user/${userid}`);
      //신고자 피신고자 id만 다르게 넣으면 구분가능
    } catch (error) {
      console.log(error);

      // Alert.alert(error.response.data.message);
    }
  };

  return (
    <Container>
      <ReportContainer>
        <Title>제목: {temp.title}</Title>
        <Content>내용: {temp.content}</Content>
      </ReportContainer>

      <Button onPress={onViewConversation}>
        <ButtonText>대화 내역 보기</ButtonText>
      </Button>

      <Button onPress={onViewWork}>
        <ButtonText>심부름 상세 보기</ButtonText>
      </Button>

      <Button onPress={onViewUser}>
        <ButtonText>신고자 정보 보기</ButtonText>
      </Button>
      <Button onPress={onViewUser}>
        <ButtonText>피신고자 정보 보기</ButtonText>
      </Button>

      <Button onPress={() => setModalVisible(true)}>
        <ButtonText>처리하기</ButtonText>
      </Button>
      <HandleReport
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </Container>
  );
};

export default DetailReport;
