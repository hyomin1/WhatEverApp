import React from "react";
import { Modal, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Card = styled.View`
  width: 80%;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 5;
`;

const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #555;
  margin-top: 10px;
  margin-bottom: 3px;
`;

const Content = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

const ProgressButton = styled.Pressable`
  background-color: #1e90ff;
  border-radius: 8px;
  padding: 12px;
  align-items: center;
`;

const ProgressButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
`;

const DetailWork = ({
  workVisible,
  setWorkVisible,
  selectedWork,
  onPressProgress,
}) => {
  return (
    <Modal animationType="slide" visible={workVisible} transparent>
      <Container>
        <Card>
          <TitleWrapper>
            <Title>상세보기</Title>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setWorkVisible(false);
              }}
            >
              <AntDesign name="closecircleo" color="#333" size={24} />
            </TouchableOpacity>
          </TitleWrapper>

          {selectedWork && (
            <>
              <Label>제목</Label>
              <Content>{selectedWork.title}</Content>
              <Label>마감 시간</Label>
              <Content>{selectedWork.deadLineTime}시간</Content>
              <Label>상세 내용</Label>
              <Content>{selectedWork.context}</Content>
              <ProgressButton onPress={() => onPressProgress(selectedWork)}>
                <ProgressButtonText>진행 요청</ProgressButtonText>
              </ProgressButton>
            </>
          )}
        </Card>
      </Container>
    </Modal>
  );
};

export default DetailWork;
