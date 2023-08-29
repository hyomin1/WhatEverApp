import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { alarmData, alarmViewData } from "../atom";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;
const TitleBar = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 50px;
  width: 300px;
  background-color: white;
  padding: 5px 10px;
  border-bottom-width: 2px;
`;

const Title = styled.View`
  flex: 1;
  align-items: center;
`;
const AlarmListContainer = styled.ScrollView`
  background-color: white;
  width: 300px;
  overflow: hidden;

  //max-height: 700px;
`;

const AlarmItem = styled.View`
  border-bottom-width: 1px;
  border-color: #ccc;
  padding: 10px;
`;

const AlarmTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: gray;
`;

const CloseButton = styled.TouchableOpacity`
  //background-color: #ff6b6b;
  padding: 10px 20px;
  border-radius: 5px;
  align-self: center;

  flex: 1;
`;

const CloseButtonText = styled.Text`
  //color: white;

  text-align: center;
`;

const AlarmView = () => {
  const alarm = useRecoilValue(alarmData);
  const [visible, setVisible] = useRecoilState(alarmViewData);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Container>
        <TitleBar>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setVisible(false)}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Title>
            <Text style={{ fontWeight: "bold" }}>알람 목록</Text>
          </Title>
          <View style={{ flex: 1 }}></View>
        </TitleBar>
        <AlarmListContainer>
          {alarm?.map((data, index) => (
            <AlarmItem key={index}>
              <AlarmTitle>{data.title}</AlarmTitle>
            </AlarmItem>
          ))}
        </AlarmListContainer>
      </Container>
    </Modal>
  );
};

export default AlarmView;
