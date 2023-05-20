import { Text, View, Modal, TextInput, Pressable } from "react-native";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { historyWorkData } from "../atom";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

const HistoryInformation = styled.View`
  margin-top: 15px;
  flex-direction: row;
  flex: 1;
  border-bottom-color: black;
  border-bottom-width: 0.5px;
`;
const ReportInput = styled.TextInput`
  height: 40px;
  border-width: 0.9px;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 40px;
  width: 50%;
`;

const History = () => {
  const historyWork = useRecoilValue(historyWorkData);
  const [reportVisible, setReportVisible] = useState(false);

  const [report, setReport] = useState();

  const onChangeReport = (payload) => {
    setReport(payload);
  };

  const onPressReport = () => {
    //신고버튼 누를때
    console.log("신고");
    setReportVisible(!reportVisible);
  };
  const onPressReportComplete = () => {
    //신고 완료
    setReportVisible(!reportVisible);
    console.log("신고완료");
  };
  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      {historyWork
        ? historyWork.map((data, index) => (
            <HistoryInformation key={index}>
              <Text>제목 : {data.title} </Text>
              <Text>내용 : {data.context} </Text>
              <Text>마감시간 : {data.deadLineTime} </Text>
              <MaterialIcons
                onPress={onPressReport}
                name="report"
                size={24}
                color="red"
              />
            </HistoryInformation>
          ))
        : null}
      <Modal animationType="slide" transparent={true} visible={reportVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            <ReportInput
              onChangeText={onChangeReport}
              placeholder="신고 사유..."
            />
            <Pressable onPress={onPressReportComplete}>
              <Text>신고하기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default History;
