import React from "react";
import { useState } from "react";
import { View, Text } from "react-native";
import { useRecoilValue } from "recoil";
import styled from "styled-components/native";
import { historyReportData } from "../atom";
import Report from "./Report";

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #f5f5f5;
`;

const ReportItem = styled.View`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
`;

const ReportTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const ReportReason = styled.Text`
  font-size: 16px;
`;
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
const Btn = styled.TouchableOpacity`
  background-color: #3498db;
  width: 80px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-top: 10px;
`;

const BtnText = styled.Text`
  color: white;
  font-weight: 600;
`;

const ReportResult = ({ status }) => {
  const historyReport = useRecoilValue(historyReportData);
  const [reportVisible, setReportVisible] = useState(false);
  const onDeleteReport = () => {};
  return (
    <View>
      {historyReport?.map((data, index) =>
        data.reportExecuteCode === 0 && status === "처리 전" ? (
          <HistoryInformation key={index}>
            <HistoryText>{data.reportTitle}</HistoryText>
            <HistoryDescription>{data.reportReason}</HistoryDescription>
            <HistoryDescription>
              신고일 {data.createdTime.slice(0, 10)}
              {data.createdTime.slice(11, 16)}
            </HistoryDescription>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <Btn onPress={() => setReportVisible(!reportVisible)}>
                <BtnText>수정</BtnText>
              </Btn>
              <Btn onPress={onDeleteReport}>
                <BtnText>삭제</BtnText>
              </Btn>
              <Report
                reportVisible={reportVisible}
                setReportVisible={setReportVisible}
                id={data.id}
              />
            </View>
          </HistoryInformation>
        ) : (
          data.reportExecuteCode !== 0 &&
          status === "처리 완료" && (
            <HistoryInformation key={index}>
              <HistoryText>{data.reportTitle}</HistoryText>
              <HistoryDescription>{data.reportReason}</HistoryDescription>
              <HistoryDescription>
                신고일 {data.createdTime.slice(0, 10)}
                {data.createdTime.slice(11, 16)}
              </HistoryDescription>
            </HistoryInformation>
          )
        )
      )}
    </View>
  );
};

export default ReportResult;
