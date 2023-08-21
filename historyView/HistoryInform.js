import styled from "styled-components/native";
import {
  Text,
  Pressable,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../api";

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
  console.log(data);
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
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            onPressReport(index);
          }}
        >
          <Text style={{ color: "red", fontSize: 18, fontWeight: "600" }}>
            신고
          </Text>
          <Ionicons name="alert-circle" size={28} color="red" />
        </TouchableOpacity>
      ) : null}
      {!isReport ? (
        <View>
          <TouchableOpacity
            onPress={() => {
              // axios
              // .delete(`${BASE_URL}/api/work/${data.id}`)
              //.then((res) => console.log(res.data));
            }}
          >
            <MaterialIcons name="delete" size={24} />
          </TouchableOpacity>
        </View>
      ) : null}
    </HistoryInformation>
  );
};
export default HistoryInform;
