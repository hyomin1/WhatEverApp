import React, { useState } from "react";
import { Modal, FlatList, View } from "react-native";
import styled from "styled-components/native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
`;

const ContentContainer = styled.View`
  width: 85%;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 20px;
  max-height: 500px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
  flex: 1;
`;

const CloseButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
`;

const CloseIcon = styled(Ionicons)`
  font-size: 30px;
  color: #333;
`;

const CardContainer = styled.View`
  background-color: #0fbcf9;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;
const CardText = styled.Text`
  color: #ffffff;
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 10px;
`;
const CardTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
  font-style: italic;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;
const CardDescription = styled.Text`
  color: #f5f5f5;
  font-weight: bold;
  font-size: 16px;
`;

const CardReward = styled.Text`
  font-size: 16px;
  text-align: center;
  color: #ffa500;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const HelperWorkList = ({ modalVisible, setModalVisible, completedWork }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <ModalContainer>
        <ContentContainer>
          <HeaderContainer>
            <CloseButton onPress={() => setModalVisible(!modalVisible)}>
              <CloseIcon name="arrow-back" />
            </CloseButton>
            <ModalTitle>심부름 목록</ModalTitle>

            <View style={{ flex: 1 }}></View>
          </HeaderContainer>
          <FlatList
            data={completedWork}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CardContainer>
                <CardText>
                  {item.createdTime.slice(5, 7)}월{" "}
                  {item.createdTime.slice(8, 10)}일
                </CardText>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.context}</CardDescription>
                <CardReward>금액 {item.reward}원</CardReward>
              </CardContainer>
            )}
          />
        </ContentContainer>
      </ModalContainer>
    </Modal>
  );
};

export default HelperWorkList;
