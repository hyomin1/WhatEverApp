import { useState } from "react";
import styled from "styled-components/native";
import { View, Text, FlatList } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { historyReportData, historyWorkData } from "../atom";
import UserCustomerHistory from "./UserCustomerHistory";
import UserHelperHistory from "./UserHelperHistory";
import SelectDropdown from "react-native-select-dropdown";
import ReportResult from "./ReportResult";
import axios from "axios";
import { BASE_URL } from "../api";
import { ScrollView } from "react-native";

const BtnView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
const StatusButton = styled.TouchableHighlight`
  flex: 1;
  border-radius: 2px;
  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: #0fbcf9;
  border: 1px solid white;
  border-bottom-width: ${(props) => (props.isSelected ? "2px" : "0px")};
`;
const StatusButtonText = styled.Text`
  color: white;
  font-weight: bold;
  text-align: center;
`;

const UserHistory = () => {
  const [status, setStatus] = useState("심부름 중");
  const changeStatus = (newStatus) => {
    setStatus(newStatus);
  };

  const historyWork = useRecoilValue(historyWorkData);

  const [isHelper, setIsHelper] = useState(true);
  const [isCustomer, setIsCustomer] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const setHistoryReport = useSetRecoilState(historyReportData);

  const onPressHelper = () => {
    setIsHelper(true);
    setIsCustomer(false);
    setIsReport(false);
    changeStatus("심부름 중");
  };
  const onPressCustomer = () => {
    setIsHelper(false);
    setIsCustomer(true);
    setIsReport(false);
    changeStatus("심부름 전");
  };
  const onPressReport = async () => {
    setIsHelper(false);
    setIsCustomer(false);
    setIsReport(true);
    changeStatus("처리 전");
    try {
      const res = await axios.get(`${BASE_URL}/api/report/reportList`);
      setHistoryReport(res.data);
      //저장해서 0이면 처리전 0아닐시 처리완료
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <View>
        <BtnView>
          {isHelper
            ? null
            : !isReport && (
                <StatusButton
                  isSelected={status === "심부름 전"}
                  underlayColor="#e0e0e0"
                  onPress={() => changeStatus("심부름 전")}
                >
                  <StatusButtonText isSelected={status === "심부름 전"}>
                    심부름 전
                  </StatusButtonText>
                </StatusButton>
              )}
          {!isReport && (
            <>
              <StatusButton
                isSelected={status === "심부름 중"}
                underlayColor="#e0e0e0"
                onPress={() => changeStatus("심부름 중")}
              >
                <StatusButtonText isSelected={status === "심부름 중"}>
                  심부름 중
                </StatusButtonText>
              </StatusButton>
              <StatusButton
                isSelected={status === "심부름 완료"}
                underlayColor="#e0e0e0"
                onPress={() => changeStatus("심부름 완료")}
              >
                <StatusButtonText isSelected={status === "심부름 완료"}>
                  심부름 완료
                </StatusButtonText>
              </StatusButton>
            </>
          )}

          {isReport ? (
            <>
              <StatusButton
                isSelected={status === "처리 전"}
                onPress={() => changeStatus("처리 전")}
              >
                <StatusButtonText isSelected={status === "처리 전"}>
                  처리 전
                </StatusButtonText>
              </StatusButton>
              <StatusButton
                isSelected={status === "처리 완료"}
                onPress={() => changeStatus("처리 완료")}
              >
                <StatusButtonText isSelected={status === "처리 완료"}>
                  처리 완료
                </StatusButtonText>
              </StatusButton>
            </>
          ) : null}
        </BtnView>
        <View style={{ alignItems: "flex-end", padding: 10 }}>
          <SelectDropdown
            buttonStyle={{
              borderWidth: 1,
              backgroundColor: "white",
              borderColor: "lightgray",
              borderRadius: 10,
              height: 30,
              width: 155,
            }}
            buttonTextStyle={{
              fontSize: 14,
            }}
            data={["도와준 심부름", "이용한 심부름", "신고 내역"]}
            onSelect={(selectedItem, index) => {
              if (index === 0) {
                onPressHelper();
              } else if (index === 1) {
                onPressCustomer();
              } else if (index === 2) {
                onPressReport();
              }
            }}
            buttonTextAfterSelection={(selectedItem) => selectedItem}
            renderDropdownIcon={() => <Text style={{ fontSize: 16 }}>▼</Text>}
            defaultButtonText="도와준 심부름"
          />
        </View>
        {isHelper && !isCustomer && !isReport && (
          <UserHelperHistory status={status} historyWork={historyWork} />
        )}
        {!isHelper && isCustomer && !isReport && (
          <UserCustomerHistory status={status} historyWork={historyWork} />
        )}
        {!isHelper && !isCustomer && isReport && (
          <ReportResult
            status={
              status === "처리 전" || status === "처리 완료" ? status : null
            }
          />
        )}
      </View>
    </View>
  );
};
export default UserHistory;
