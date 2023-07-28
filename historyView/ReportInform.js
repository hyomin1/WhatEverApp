import { View } from "react-native";
import styled from "styled-components/native";

const ReportView = styled.View`
  margin-top: 15px;
  flex: 1;
  background-color: white;
  border-radius: 20px;
  padding: 20px 20px;
`;

const ReportText = styled.Text`
  font-size: 17px;
  margin-bottom: 10px;
  font-weight: 600;
  color: #7f8fa6;
`;

const ReportInform = ({ data }) => {
  return (
    <ReportView>
      <ReportText>{data.reportReason}</ReportText>
      <ReportText>제목 : {data.work.title}</ReportText>
    </ReportView>
  );
};
export default ReportInform;
