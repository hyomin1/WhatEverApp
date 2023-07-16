import { Text, Pressable, ScrollView } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { historyWorkData, sendWorkData } from "../atom";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

import Report from "./Report";

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

const History = () => {
  const historyWork = useRecoilValue(historyWorkData);
  const [reportVisible, setReportVisible] = useState(false);

  //const chatRoomList = useRecoilValue(chatRoomListData);

  const setSendWork = useSetRecoilState(sendWorkData);

  const onPressReport = (index) => {
    //신고버튼 누를때
    setSendWork(historyWork[index]);
    setReportVisible(!reportVisible);
  };

  return (
    <ScrollView
      style={{ backgroundColor: "#dcdde1", flex: 1, paddingHorizontal: 20 }}
    >
      {historyWork
        ? historyWork.map((data, index) => (
            <HistoryInformation key={index}>
              <HistoryText>제목 : {data.title} </HistoryText>
              <HistoryText>내용 : {data.context} </HistoryText>
              <HistoryText>마감시간 : {data.deadLineTime}시간 </HistoryText>
              <Pressable
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
              </Pressable>
            </HistoryInformation>
          ))
        : null}
      <Report
        reportVisible={reportVisible}
        setReportVisible={setReportVisible}
      />
    </ScrollView>
  );
};

export default History;
