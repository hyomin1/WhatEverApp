import React from "react";
import styled from "styled-components/native";
import { Text, View } from "react-native";

const Container = styled.View`
  flex: 1;
  padding: 40px;
  background-color: #f5f5f5;
`;

const Card = styled.View`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 5;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #888;
  margin-top: 5px;
`;

const EmphasizedSubtitle = styled(Subtitle)`
  color: #3498db;
  font-weight: bold;
  font-size: 16px;
`;

const DateSubtitle = styled(Subtitle)`
  font-size: 14px;
  color: #888;
`;

const RewardSubtitle = styled(Subtitle)`
  font-size: 18px;
  color: #f39c12; /* 리워드에 어울리는 초록색 */
  font-weight: bold;
  margin-top: 20px;
  align-self: center;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
`;

const WorkDetailScreen = ({ route }) => {
  const { work } = route.params;

  return (
    <Container>
      <Card>
        <Title>{work.title}</Title>
        <Subtitle>{work.context}</Subtitle>
        <Divider />
        <DateSubtitle>
          <EmphasizedSubtitle>작성일</EmphasizedSubtitle>{" "}
          {work.createdTime.slice(0, 10)} {work.createdTime.slice(11, 16)}
        </DateSubtitle>
        <Subtitle>
          <EmphasizedSubtitle>마감시간</EmphasizedSubtitle> {work.deadLineTime}
          시간
        </Subtitle>
        <Divider />
        <RewardSubtitle>심부름 비 {work.reward}원</RewardSubtitle>
      </Card>
    </Container>
  );
};

export default WorkDetailScreen;
