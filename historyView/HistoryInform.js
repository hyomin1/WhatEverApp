import styled from "styled-components/native";
import {
  Text,
  Pressable,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

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
  font-weight: 600;
  color: #7f8fa6;
`;

const HistoryInform = ({ data, index, onPressReport, isReport }) => {
  return (
    <HistoryInformation>
      <HistoryText>제목 : {data.title} </HistoryText>
      <HistoryText>내용 : {data.context} </HistoryText>
      <HistoryText>마감시간 : {data.deadLineTime}시간 </HistoryText>
      {isReport ? (
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            onPressReport(index);
          }}
        >
          <Text style={{ color: "red", fontSize: 18, fontWeight: "600" }}>
            신고하기
          </Text>
          <MaterialIcons name="report" size={24} color="red" />
        </TouchableOpacity>
      ) : null}
      {!isReport ? (
        <Pressable onPress={() => {}}>
          <Text>삭제</Text>
        </Pressable>
      ) : null}
    </HistoryInformation>
  );
};
export default HistoryInform;
