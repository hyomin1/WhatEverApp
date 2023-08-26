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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 10,
            }}
            onPress={() => {
              onPressReport(index);
            }}
          >
            <Text style={{ color: "red", fontSize: 18, fontWeight: "600" }}>
              신고
            </Text>
            <Ionicons name="alert-circle" size={28} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              isSetStarRating((cur) => !cur);
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text style={{ color: "blue", fontSize: 18, fontWeight: "600" }}>
              후기 작성
            </Text>
            <Ionicons name="create" size={28} color="blue" />
          </TouchableOpacity>
          <Modal animationType="slide" visible={isStarRating}>
            <Rating workId={data.id} isSetStarRating={isSetStarRating} />
          </Modal>
        </View>
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
