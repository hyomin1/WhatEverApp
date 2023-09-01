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
  ${({ seen }) => seen && "background-color: #f5f5f5;"}
`;

const AlarmTitle = styled.Text`
  font-size: 14px;
  color: ${({ seen }) => (seen ? "#999" : "#333")};
  font-weight: ${({ seen }) => (seen ? "normal" : "bold")};
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
            <AlarmItem seen={data.seen} key={index}>
              <AlarmTitle seen={data.seen}>{data.body}</AlarmTitle>
            </AlarmItem>
          ))}
        </AlarmListContainer>
      </Container>
    </Modal>
  );
};

export default AlarmView;
