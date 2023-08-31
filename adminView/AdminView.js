import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { View, Text, Alert } from "react-native";
import styled from "styled-components/native";
import { BASE_URL } from "../api";
import ReportView from "./ReportView";
const Container = styled.View`
  flex: 1;
`;
const SelectView = styled.View`
  flex-direction: row;
`;
const SelectBtn = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-color: black;
  background-color: #0fbcf9;
  border-radius: 2px;
  border-color: white;
  border-width: 1px;
`;
const SelectText = styled.Text`
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
`;
const AdminView = () => {
  const [isHelper, setIsHelper] = useState(false);
  const [userReport, setUserReport] = useState([]);
  const [helperReport, setHelperReport] = useState([]);
  useEffect(() => {
    console.log("render");
  }, []);
  const onViewCustomer = async () => {
    setIsHelper(false);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/report/reportList/writeByCustomer`
      );
      setUserReport(res.data);
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };
  const onViewHelper = async () => {
    setIsHelper(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/report/reportList/writeByCustomer`
      );
      setHelperReport(res.data);
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };

  return (
    <Container>
      <SelectView>
        <SelectBtn
          style={{
            borderBottomWidth: !isHelper ? 2 : 0,
          }}
          onPress={onViewCustomer}
        >
          <SelectText>고객 신고 보기</SelectText>
        </SelectBtn>
        <SelectBtn
          style={{
            borderBottomWidth: isHelper ? 2 : 0,
          }}
          onPress={onViewHelper}
        >
          <SelectText>헬퍼 신고 보기</SelectText>
        </SelectBtn>
      </SelectView>
      <ReportView report={isHelper ? helperReport : userReport} />
    </Container>
  );
};

export default AdminView;
