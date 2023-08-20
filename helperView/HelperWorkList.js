import React, { useState } from "react";
import { Modal, FlatList } from "react-native";
import styled from "styled-components/native";

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  background-color: white;
`;

const ModalTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
`;

const TaskItem = styled.View`
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

const TaskTitle = styled.Text`
  font-size: 18px;
`;

const CloseButton = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 10px;
  background-color: #3498db;
  border-radius: 10px;
  width: 50%;
  align-self: center;
`;

const CloseButtonText = styled.Text`
  color: white;
  font-size: 16px;
  text-align: center;
`;

const HelperWorkList = ({ modalVisible, setModalVisible }) => {
  const [completedTasks, setCompletedTasks] = useState([
    { id: 1, title: "Buy groceries" },
    { id: 2, title: "Walk the dog" },
    // Add more completed tasks here
  ]);

  const renderItem = ({ item }) => (
    <TaskItem>
      <TaskTitle>{item.title}</TaskTitle>
    </TaskItem>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <ModalContainer>
        <ModalTitle>완료한 일들</ModalTitle>
        <FlatList
          data={completedTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
        <CloseButton onPress={() => setModalVisible(false)}>
          <CloseButtonText>닫기</CloseButtonText>
        </CloseButton>
      </ModalContainer>
    </Modal>
  );
};

export default HelperWorkList;
