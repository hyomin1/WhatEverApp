import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components/native";
import { adminTokenData, adminWorkData } from "../atom";
import { BASE_URL } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const ReportItem = styled.TouchableOpacity`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const SubTitle = styled.Text`
  font-size: 14px;
  color: #888888;
  margin-top: 5px;
`;

const ReportView = ({ report, isHelper }) => {
  const navigation = useNavigation();
  const adminToken = useRecoilValue(adminTokenData);
  const setAdminWork = useSetRecoilState(adminWorkData);
  const onPressDetail = async (report) => {
    try {
      const token = await AsyncStorage.getItem("adminToken");
      const res = await axios.get(`${BASE_URL}/admin/work/${report.workId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminWork(res.data);
      navigation.navigate("DetailReport", {
        report, //report로 수정
        isHelper,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => (
    <ReportItem onPress={() => onPressDetail(item)}>
      <Title>{item.reportTitle}</Title>
      <SubTitle>
        작성일 {item.createdTime.slice(0, 10)} {item.createdTime.slice(11, 16)}
      </SubTitle>
    </ReportItem>
  );

  return (
    <Container>
      <FlatList
        data={report} //report넣기
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
};

export default ReportView;
