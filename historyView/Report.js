import { Modal, View } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api";
import { useRecoilValue } from "recoil";
import { sendWorkData } from "../atom";
import { MaterialIcons } from "@expo/vector-icons";

const TitleBar = styled.View`
  flex-direction: row;
  background-color: white;
  align-items: center;
  height: 30px;
  padding: 0px 10px;
`;
const TitleView = styled.View`
  flex: 1;
`;
const Title = styled.Text`
  font-weight: 600;
  font-size: 17px;
`;
const ReportView = styled.View`
  width: 100%;
  align-items: center;
  background-color: white;
  padding: 80px 0;
  border: 1px solid black;
`;

const ReportInput = styled.TextInput`
  height: 40px;
  border-width: 0.9px;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 40px;
  width: 300px;
  height: 400px;
`;
const ReprotBtn = styled.Pressable`
  background-color: red;
  width: 100px;
  height: 30px;
  justify-content: center;
  align-items: center;
`;
const ReportBtnText = styled.Text`
  font-weight: 600;
  color: white;
  font-size: 15px;
`;

const Report = ({ reportVisible, setReportVisible }) => {
  const [report, setReport] = useState(); //신고 사유
  const sendWork = useRecoilValue(sendWorkData); //신고할 일의 내용

  const onChangeReport = (payload) => {
    setReport(payload);
  };

  const onPressReportComplete = () => {
    //신고 완료
    setReportVisible(!reportVisible);
    console.log(sendWork);
    axios
      .post(`${BASE_URL}/api/report`, {
        work: sendWork,
        reportReason: report,
      })
      .then(({ data }) => {
        console.log("신고완료", data);
      });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      onRequestClose={() => setReportVisible(!reportVisible)}
      visible={reportVisible}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, opacity: 0.8, backgroundColor: "gray" }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TitleBar>
              <TitleView>
                <MaterialIcons
                  onPress={() => {
                    setReportVisible(!reportVisible);
                  }}
                  name="cancel"
                  size={24}
                  color="black"
                />
              </TitleView>
              <TitleView style={{ alignItems: "center" }}>
                <Title>신고서 작성하기</Title>
              </TitleView>
              <TitleView></TitleView>
            </TitleBar>
            <ReportView>
              <ReportInput
                onChangeText={onChangeReport}
                placeholder="신고 사유..."
              />
              <View style={{ alignItems: "flex-end" }}>
                <ReprotBtn onPress={onPressReportComplete}>
                  <ReportBtnText>신고하기</ReportBtnText>
                </ReprotBtn>
              </View>
            </ReportView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Report;
