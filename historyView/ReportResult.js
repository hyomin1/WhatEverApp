import { useEffect } from "react";
import { View, Text } from "react-native";
import { useRecoilValue } from "recoil";
import { historyReportData } from "../atom";

const ReportResult = ({ status }) => {
  const historyReport = useRecoilValue(historyReportData);

  //console.log(historyReport);
  return (
    <View>
      <Text>신고결과 {status}</Text>
    </View>
  );
};
export default ReportResult;
