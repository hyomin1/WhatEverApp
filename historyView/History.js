import { Pressable, ScrollView } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { adminData, historyWorkData, reportData, sendWorkData } from "../atom";
import styled from "styled-components/native";

import { useState } from "react";

import Report from "./Report";
import HistoryInform from "./HistoryInform";

const BtnView = styled.View`
  flex-direction: row;
  display: flex;
  left: 150px;
  padding: 5px 0px;
`;
const BtnText = styled.Text`
  margin-right: 5px;
`;

const History = () => {
  const historyWork = useRecoilValue(historyWorkData);
  const [reportVisible, setReportVisible] = useState(false); //신고 팝업

  //const chatRoomList = useRecoilValue(chatRoomListData);

  const setSendWork = useSetRecoilState(sendWorkData);

  const isAdmin = useRecoilValue(adminData);
  const reportList = useRecoilValue(reportData);
  const onPressReport = (index) => {
    //신고버튼 누를때
    setSendWork(historyWork[index]);
    setReportVisible(!reportVisible);
  };

  const [workComplete, setWorkComplete] = useState(true); //이용 완료
  const [working, setWorking] = useState(false);
  const [beforeWork, setBeforeWork] = useState(false);
  //isAdmin 일 경우 신고내역 보게 하고  유저일 경우 이용내역 view 가르기
  return (
    <ScrollView
      style={{ backgroundColor: "#dcdde1", flex: 1, paddingHorizontal: 20 }}
    >
      <BtnView>
        <Pressable
          onPress={() => {
            setWorkComplete(true);
            setWorking(false);
            setBeforeWork(false);
          }}
        >
          <BtnText style={{ color: workComplete ? "black" : "gray" }}>
            심부름 완료
          </BtnText>
        </Pressable>
        <Pressable
          onPress={() => {
            setWorkComplete(false);
            setWorking(true);
            setBeforeWork(false);
          }}
        >
          <BtnText style={{ color: working ? "black" : "gray" }}>
            심부름 중
          </BtnText>
        </Pressable>
        <Pressable
          onPress={() => {
            setWorkComplete(false);
            setWorking(false);
            setBeforeWork(true);
          }}
        >
          <BtnText style={{ color: beforeWork ? "black" : "gray" }}>
            심부름 전
          </BtnText>
        </Pressable>
      </BtnView>
      {historyWork
        ? historyWork.map((data, index) =>
            workComplete && data.finished && !data.proceeding ? (
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
        ? historyWork.map((data, index) =>
            working && !data.finished && data.proceeding ? (
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
        ? historyWork.map((data, index) =>
            beforeWork && !data.finished && !data.proceeding ? (
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
    </ScrollView>
  );
};

export default History;
