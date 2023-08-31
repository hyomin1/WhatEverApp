import styled from "styled-components/native";
import {
  Text,
  Pressable,
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../api";
import Rating from "../chatView/Rating";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { historyWorkData, workListData } from "../atom";

const HistoryInformation = styled.View`
  margin-top: 15px;
  flex: 1;
  background-color: white;
  border-radius: 20px;
  padding: 20px 20px;
`;

const HistoryText = styled.Text`
  font-size: 17px;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333333;
`;
const HistoryDescription = styled.Text`
  font-size: 14px;
  color: #888888;
  margin-bottom: 10px;
`;

const ActionButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin: 10px 0px;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 8px 15px;
  background-color: ${(props) => props.backgroundColor || "#3498db"};
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.color || "black"};
  font-size: 18px;
  font-weight: bold;
  margin-left: 5px;
`;

const HistoryInform = ({ data, index, onPressReport, isReport }) => {
  const [isStarRating, isSetStarRating] = useState(false);
  const setHistoryWork = useSetRecoilState(historyWorkData);
  const setWorkList = useSetRecoilState(workListData);
  const onDeleteItem = (itemId) => {
    Alert.alert(
      "삭제 확인",
      "정말로 이 심부름을 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          onPress: () => {
            axios.delete(`${BASE_URL}/api/work/${itemId}`).then(({ data }) => {
              setHistoryWork(data);
              setWorkList(data);
            });
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <HistoryInformation>
      <View>
        <HistoryText> {data.title} </HistoryText>
        <HistoryDescription> {data.context} </HistoryDescription>
        <HistoryDescription>
          마감시간 : {data.deadLineTime}시간
        </HistoryDescription>
      </View>
      {isReport ? (
        <ActionButtonsContainer>
          <ActionButton
            onPress={() => {
              isSetStarRating((cur) => !cur);
            }}
            backgroundColor="#4caf50"
          >
            <ButtonText color="white">리뷰작성</ButtonText>
          </ActionButton>
          <ActionButton
            backgroundColor="red"
            onPress={() => {
              onPressReport(index);
            }}
          >
            <ButtonText color="white">신고하기</ButtonText>
          </ActionButton>

          <Modal animationType="slide" visible={isStarRating}>
            <Rating workId={data.id} isSetStarRating={isSetStarRating} />
          </Modal>
        </ActionButtonsContainer>
      ) : null}
      {!isReport ? (
        <View>
          <TouchableOpacity onPress={() => onDeleteItem(data.id)}>
            <MaterialIcons name="delete" size={24} />
          </TouchableOpacity>
        </View>
      ) : null}
    </HistoryInformation>
  );
};
export default HistoryInform;
