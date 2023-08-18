import { View } from "react-native";
import { historyWorkData, myIdData, sendWorkData } from "../atom";
import { useState } from "react";
import Report from "./Report";
import HistoryInform from "./HistoryInform";
import { useRecoilValue, useSetRecoilState } from "recoil";

const UserCustomerHistory = ({ workComplete, working, beforeWork }) => {
  const historyWork = useRecoilValue(historyWorkData);
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
            workComplete &&
            data.finished &&
            !data.proceeding ? (
              <HistoryInform
                key={index}
                data={data}
                index={index}
                onPressReport={onPressReport}
                isReport={true}
              />
            ) : null
          )
        : null}
      {historyWork
        ? historyWork?.map((data, index) =>
            myId === data.customerId &&
            working &&
            !data.finished &&
            data.proceeding ? (
              <HistoryInform
                key={index}
                data={data}
                index={index}
                onPressReport={onPressReport}
                isReport={true}
              />
            ) : null
          )
        : null}
      {historyWork
        ? historyWork?.map((data, index) =>
            myId === data.customerId &&
            beforeWork &&
            !data.finished &&
            !data.proceeding ? (
              <HistoryInform
                key={index}
                data={data}
                index={index}
                onPressReport={onPressReport}
                isReport={false}
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
