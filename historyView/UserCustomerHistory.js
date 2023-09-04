import { View, ScrollView } from "react-native";
import { myIdData, sendWorkData } from "../atom";
import { useState } from "react";
import Report from "./Report";
import HistoryInform from "./HistoryInform";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components/native";
const ViewS = styled.View`
  border: 1px solid black;
`;

const UserCustomerHistory = ({ historyWork, status }) => {
  const myId = useRecoilValue(myIdData);

  const setSendWork = useSetRecoilState(sendWorkData);
  const [reportVisible, setReportVisible] = useState(false); //신고 팝업

  const onPressReport = (index) => {
    //신고버튼 누를때
    setSendWork(historyWork[index]);
    setReportVisible(!reportVisible);
  };

  return (
    <View>
      {historyWork
        ? historyWork?.map((data, index) =>
            myId === data.customerId &&
            status === "심부름 전" &&
            data.workProceedingStatus === 0 ? (
              <HistoryInform
                data={data}
                index={index}
                onPressReport={onPressReport}
              />
            ) : null
          )
        : null}
      {historyWork
        ? historyWork?.map((data, index) =>
            myId === data.customerId &&
            status === "심부름 중" &&
            (data.workProceedingStatus === 1 ||
              data.workProceedingStatus === 2) ? (
              <HistoryInform
                key={index}
                data={data}
                index={index}
                onPressReport={onPressReport}
              />
            ) : null
          )
        : null}
      {historyWork
        ? historyWork?.map((data, index) =>
            myId === data.customerId &&
            status === "심부름 완료" &&
            data.workProceedingStatus === 3 ? (
              <HistoryInform
                key={index}
                data={data}
                index={index}
                onPressReport={onPressReport}
              />
            ) : null
          )
        : null}

      <Report
        reportVisible={reportVisible}
        setReportVisible={setReportVisible}
      />
    </View>
  );
};
export default UserCustomerHistory;
