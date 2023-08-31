import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, Text, View } from "react-native";
import styled from "styled-components/native";

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

const ReportView = ({ report }) => {
  const navigation = useNavigation();
  const temp = [
    //삭제
    {
      title: "fuck",
      createdAt: "2022-02-03",
      content: "bad",
      id: 1,
    },
    {
      title: "fuck ass",
      createdAt: "2022-02-04",
      content: "hell",
      id: 2,
    },
  ];
  const onPressDetail = (temp) => {
    navigation.navigate("DetailReport", {
      temp, //report로 수정
    });
  };
  const renderItem = ({ item }) => (
    <ReportItem onPress={() => onPressDetail(item)}>
      <Title>{item.title}</Title>
      <SubTitle>작성일: {item.createdAt}</SubTitle>
    </ReportItem>
  );

  return (
    <Container>
      <FlatList
        data={temp} //report넣기
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
};

export default ReportView;
