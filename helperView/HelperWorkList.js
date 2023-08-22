import React, { useState } from "react";
import { Modal, FlatList } from "react-native";
import styled from "styled-components/native";

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;
const ModalContent = styled.View`
  background-color: white;
  border-radius: 20px;
  padding: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  align-self: center;
`;

const TaskItem = styled.View`
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

const TaskTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;
const TaskDescription = styled.Text`
  font-size: 16px;
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

const HelperWorkList = ({ modalVisible, setModalVisible, completedWork }) => {
  //console.log("A", completedWork);
  const renderItem = ({ item }) => (
    <TaskItem>
      <TaskTitle>{item.title}</TaskTitle>
      <TaskDescription>{item.context}</TaskDescription>
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
        <ModalContent>
          <ModalTitle>완료한 일들</ModalTitle>
          <FlatList
            data={completedWork}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <CloseButton onPress={() => setModalVisible(false)}>
            <CloseButtonText>닫기</CloseButtonText>
          </CloseButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default HelperWorkList;
