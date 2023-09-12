import React, { useEffect } from "react";
import { useState } from "react";
import { View, Text } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components/native";
import { historyReportData } from "../atom";
import Report from "./Report";
import axios from "axios";
import { BASE_URL } from "../api";
import { Alert, Modal, TouchableOpacity } from "react-native";

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
  const [historyReport, setHistoryReport] = useRecoilState(historyReportData);
  const [reportVisible, setReportVisible] = useState(false);
  const onDeleteReport = async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/report/${id}`);
      setHistoryReport(res.data);
      Alert.alert("삭제 완료");
    } catch (error) {
      console.log(error);
    }
  };
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      {historyReport?.map((data, index) =>
        data.reportExecuteCode === 0 && status === "처리 전" ? (
          <HistoryInformation key={index}>
            <HistoryText>{data.reportTitle}</HistoryText>
            <HistoryDescription>{data.reportReason}</HistoryDescription>
            <HistoryDescription>
              신고일 {data.createdTime.slice(0, 10)}{" "}
              {data.createdTime.slice(11, 16)}
            </HistoryDescription>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <Btn onPress={() => setReportVisible(!reportVisible)}>
                <BtnText>수정</BtnText>
              </Btn>
              <Btn onPress={() => onDeleteReport(data.id)}>
                <BtnText>삭제</BtnText>
              </Btn>
              <Report
                reportVisible={reportVisible}
                setReportVisible={setReportVisible}
                id={data.id}
                fix={true}
              />
            </View>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Text>상세보기</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} animationType="slide">
              <View>
                <Text onPress={() => setModalVisible(!modalVisible)}>
                  상세 정보
                </Text>
                <Text>{data.executeDetail}</Text>
              </View>
              {status === "처리 완료" && data.reportExecuteCode !== 0 ? (
                <View>
                  {data.reportExecuteCode === 1 ? (
                    <Text>기각</Text>
                  ) : data.reportExecuteCode === 2 ? (
                    <Text>환불</Text>
                  ) : data.reportExecuteCode === 3 ? (
                    <Text>3일 정지</Text>
                  ) : data.reportExecuteCode === 4 ? (
                    <Text>7일 정지</Text>
                  ) : data.reportExecuteCode === 5 ? (
                    <Text>30일 정지</Text>
                  ) : data.reportExecuteCode === 6 ? (
                    <Text>영구 정지</Text>
                  ) : null}
                </View>
              ) : null}
            </Modal>
          </HistoryInformation>
        ) : (
          data.reportExecuteCode !== 0 &&
          status === "처리 완료" && (
            <HistoryInformation key={index}>
              <HistoryText>{data.reportTitle}</HistoryText>
              <HistoryDescription>{data.reportReason}</HistoryDescription>
              <HistoryDescription>
                신고일 {data.createdTime.slice(0, 10)}{" "}
                {data.createdTime.slice(11, 16)}
              </HistoryDescription>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Text>상세보기</Text>
              </TouchableOpacity>
              <Modal visible={modalVisible} animationType="slide">
                <View>
                  <Text onPress={() => setModalVisible(!modalVisible)}>
                    상세 정보
                  </Text>
                  <Text>{data.executeDetail}</Text>
                </View>
                {status === "처리 완료" && data.reportExecuteCode !== 0 ? (
                  <View>
                    {data.reportExecuteCode === 1 ? (
                      <Text>기각</Text>
                    ) : data.reportExecuteCode === 2 ? (
                      <Text>환불</Text>
                    ) : data.reportExecuteCode === 3 ? (
                      <Text>3일 정지</Text>
                    ) : data.reportExecuteCode === 4 ? (
                      <Text>7일 정지</Text>
                    ) : data.reportExecuteCode === 5 ? (
                      <Text>30일 정지</Text>
                    ) : data.reportExecuteCode === 6 ? (
                      <Text>영구 정지</Text>
                    ) : null}
                  </View>
                ) : null}
              </Modal>
            </HistoryInformation>
          )
        )
      )}
    </View>
  );
};

export default ReportResult;
