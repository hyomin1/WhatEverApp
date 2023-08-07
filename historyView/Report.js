import { Modal, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api";
import { useRecoilValue } from "recoil";
import { sendWorkData } from "../atom";
import { MaterialIcons } from "@expo/vector-icons";

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* 뒷 배경을 어둡게 */
`;

const ModalContent = styled.View`
  background-color: white;
  border-radius: 10px;
  padding: 16px;
  width: 80%;
`;

const TitleBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const ReportView = styled.View`
  align-items: center;
`;

const ReportInput = styled.TextInput`
  width: 100%;
  height: 100px;
  border-width: 1px;
  border-color: gray;
  border-radius: 5px;
  margin-bottom: 16px;
  padding: 0px 8px;
`;

const ReportBtn = styled.TouchableOpacity`
  background-color: red;
  padding: 8px 16px;
  border-radius: 5px;
`;

const ReportBtnText = styled.Text`
  color: white;
  font-weight: bold;
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
      <ModalContainer>
        <ModalContent>
          <TitleBar>
            <TouchableOpacity>
              <MaterialIcons
                onPress={() => {
                  setReportVisible(!reportVisible);
                }}
                name="cancel"
                size={24}
                color="black"
              />
            </TouchableOpacity>

            <Title>신고서 작성하기</Title>
            <View />
          </TitleBar>
          <ReportView>
            <ReportInput
              onChangeText={onChangeReport}
              placeholder="신고 사유..."
            />

            <ReportBtn onPress={onPressReportComplete}>
              <ReportBtnText>신고하기</ReportBtnText>
            </ReportBtn>
          </ReportView>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default Report;
