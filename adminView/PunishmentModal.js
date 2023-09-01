import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import styled from "styled-components/native";

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  background-color: white;
  border-radius: 10px;
  width: 90%;
  max-height: 80%;
`;
const TiTle = styled.Text`
  font-size: 18px;
  align-self: center;
  font-weight: bold;
  padding: 10px 0px;
`;
const CloseButtonContainer = styled.View`
  align-items: center;
  margin: 10px 0;
`;

const CloseButton = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 10px 20px;
  border-radius: 8px;
`;

const CloseButtonText = styled.Text`
  font-size: 16px;
  color: white;
  font-weight: bold;
`;
const LogTextTime = styled.Text`
  color: #333;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;
const LogItem = styled.View`
  border-bottom-width: 1px;
  border-color: #ccc;
  padding: 20px;
`;

const LogText = styled.Text`
  font-size: 15px;
  color: #666;
  font-weight: bold;
`;

const PunishmentModal = ({ isVisible, data, onClose }) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <ModalContainer>
        <ModalContent>
          <TiTle>처벌 기록</TiTle>
          <ScrollView>
            {data.length > 0 ? (
              data.map((log, index) => (
                <LogItem key={index}>
                  <LogTextTime>{log.createdTime.slice(0, 10)}</LogTextTime>
                  <LogText>처벌 사유: {log.executeDetail}</LogText>
                  {log.reportExecuteCode === 1 && (
                    <LogText>처벌 결과: 기각</LogText>
                  )}
                  {log.reportExecuteCode === 2 && (
                    <LogText>처벌 결과: 환불</LogText>
                  )}
                  {log.reportExecuteCode === 3 && (
                    <LogText>처벌 결과: 3일 정지</LogText>
                  )}
                  {log.reportExecuteCode === 4 && (
                    <LogText>처벌 결과: 7일 정지</LogText>
                  )}
                  {log.reportExecuteCode === 5 && (
                    <LogText>처벌 결과: 30일 정지</LogText>
                  )}
                  {log.reportExecuteCode === 6 && (
                    <LogText>처벌 결과: 영구 정지</LogText>
                  )}
                </LogItem>
              ))
            ) : (
              <Text style={{ alignSelf: "center", color: "#888" }}>
                처벌 기록이 존재하지 않습니다
              </Text>
            )}
          </ScrollView>
          <CloseButtonContainer>
            <CloseButton onPress={onClose}>
              <CloseButtonText>닫기</CloseButtonText>
            </CloseButton>
          </CloseButtonContainer>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default PunishmentModal;
