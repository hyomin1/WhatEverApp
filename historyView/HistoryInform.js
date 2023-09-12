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
import { useRecoilValue, useSetRecoilState } from "recoil";
import { historyWorkData, myIdData, workListData } from "../atom";

const HistoryInformation = styled.View`
  margin-top: 15px;
  flex: 1;
  background-color: white;
  padding: 20px 20px;
  border-radius: 10px;
  margin: 5px 20px;
`;

const HistoryText = styled.Text`
  font-size: 13px;
  margin-bottom: 10px;
  font-weight: bold;
  color: #888;
`;
const HistoryTitle = styled(HistoryText)`
  font-size: 20px;
  font-weight: bold;
  color: black;
`;
const HistoryDescription = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 2px;
  font-weight: bold;
`;
const HistoryMoney = styled.Text`
  font-size: 15px;
  color: #ffa500;
  font-weight: bold;
`;

const ActionButtonsContainer = styled.View`
  margin-top: 20px;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 8px 15px;

  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: center;
  border: 1px solid #888;
  margin-bottom: 10px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-left: 5px;
`;

const HistoryInform = ({ data, index, onPressReport }) => {
  const [isStarRating, isSetStarRating] = useState(false);
  const setHistoryWork = useSetRecoilState(historyWorkData);
  const setWorkList = useSetRecoilState(workListData);
  const myId = useRecoilValue(myIdData);

  const currentTime = new Date();
  const finishTime = new Date(data.finishedAt);
  const timeDiff = Math.floor((currentTime - finishTime) / (1000 * 60 * 60));

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
        <HistoryText>
          {data.createdTime.slice(0, 4)}년 {data.createdTime.slice(5, 7)}월{" "}
          {data.createdTime.slice(8, 10)}일
        </HistoryText>
        <HistoryTitle> {data.title} </HistoryTitle>
        <HistoryDescription> {data.context} </HistoryDescription>
        <HistoryDescription>마감시간 : {data.deadLineTime}H</HistoryDescription>
        <HistoryMoney> {data.reward}원</HistoryMoney>
      </View>

      <ActionButtonsContainer>
        {myId === data.customerId && data.workProceedingStatus === 3 ? (
          <ActionButton
            onPress={() => {
              isSetStarRating((cur) => !cur);
            }}
          >
            <ButtonText>리뷰작성</ButtonText>
          </ActionButton>
        ) : null}
        {/* {data.workProceedingStatus === 1 || data.workProceedingStatus === 2 ? (
          <ActionButton
            style={{ backgroundColor: "red" }}
            onPress={() => {
              onPressReport(index);
            }}
          >
            <ButtonText style={{ color: "white" }}>신고하기</ButtonText>
          </ActionButton>
        ) : null} */}
        {data.workProceedingStatus === 2 && (
          <ActionButton
            style={{ backgroundColor: "red" }}
            onPress={() => {
              onPressReport(index);
            }}
          >
            <ButtonText style={{ color: "white" }}>신고하기</ButtonText>
          </ActionButton>
        )}
        {data.workProceedingStatus === 3 && timeDiff <= 3 ? (
          <ActionButton
            style={{ backgroundColor: "red" }}
            onPress={() => {
              onPressReport(index);
            }}
          >
            <ButtonText style={{ color: "white" }}>신고하기</ButtonText>
          </ActionButton>
        ) : null}

        <Modal animationType="slide" visible={isStarRating}>
          <Rating workId={data.id} isSetStarRating={isSetStarRating} />
        </Modal>
      </ActionButtonsContainer>

      {myId === data.customerId && data.workProceedingStatus === 0 ? (
        <View style={{ alignItems: "center" }}>
          <ActionButton onPress={() => onDeleteItem(data.id)}>
            <ButtonText>삭제하기</ButtonText>
          </ActionButton>
        </View>
      ) : null}
    </HistoryInformation>
  );
};
export default HistoryInform;
