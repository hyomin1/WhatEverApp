import React, { useState } from "react";
import { Modal, FlatList } from "react-native";
import styled from "styled-components/native";
import { FontAwesome5 } from "@expo/vector-icons";

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  background-color: white;
  border-radius: 20px;
  width: 80%;
  padding: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const TaskItem = styled.View`
  padding: 15px;
  border-radius: 10px;
  background-color: #f5f5f5;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
`;

const TaskInfo = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const TaskTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const TaskDescription = styled.Text`
  font-size: 16px;
  color: #666;
`;

const CloseButton = styled.TouchableOpacity`
  margin-top: 20px;
  padding: 10px;
  background-color: #3498db;
  border-radius: 8px;
  align-self: center;
  width: 50%;
`;

const CloseButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

const HelperWorkList = ({ modalVisible, setModalVisible, completedWork }) => {
  const renderItem = ({ item }) => (
    <TaskItem>
      <FontAwesome5 name="check-circle" size={24} color="#43a047" />
      <TaskInfo>
        <TaskTitle>{item.title}</TaskTitle>
        <TaskDescription>{item.context}</TaskDescription>
      </TaskInfo>
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
          <ModalTitle>수행한 심부름 목록</ModalTitle>
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
