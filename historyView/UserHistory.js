import { useState } from "react";
import styled from "styled-components/native";
import { adminData, historyWorkData, reportData, sendWorkData } from "../atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Pressable, View } from "react-native";
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

const UserHistory = () => {
  const [workComplete, setWorkComplete] = useState(true); //이용 완료
  const [working, setWorking] = useState(false);
  const [beforeWork, setBeforeWork] = useState(false);

  const historyWork = useRecoilValue(historyWorkData);
  const [reportVisible, setReportVisible] = useState(false); //신고 팝업

  //const chatRoomList = useRecoilValue(chatRoomListData);

  const setSendWork = useSetRecoilState(sendWorkData);

  const onPressReport = (index) => {
    //신고버튼 누를때
    setSendWork(historyWork[index]);
    setReportVisible(!reportVisible);
  };
  return (
    <View>
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
    </View>
  );
};
export default UserHistory;
