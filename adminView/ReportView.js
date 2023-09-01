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

const ReportView = ({ report, isHelper }) => {
  const navigation = useNavigation();

  const onPressDetail = (report) => {
    navigation.navigate("DetailReport", {
      report, //report로 수정
      isHelper,
    });
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
