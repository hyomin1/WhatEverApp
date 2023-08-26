import { useState } from "react";
import styled from "styled-components/native";
import {
  Pressable,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRecoilValue } from "recoil";
import { historyWorkData } from "../atom";
import UserCustomerHistory from "./UserCustomerHistory";
import UserHelperHistory from "./UserHelperHistory";

const SelectView = styled.View`
  flex: 1;
  flex-direction: row;
  margin-bottom: 10px;
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
const TouchableCustom = styled.TouchableHighlight`
  //padding: 5px 10px;
  border-radius: 10px;
`;
const StatusButton = styled.TouchableHighlight`
  border-radius: 10px;
  padding: 10px 20px;
  background-color: ${(props) =>
    props.isSelected ? "#0fbcf9" : "transparent"};
  border: 2px solid #0fbcf9;
`;

const StatusButtonText = styled.Text`
  color: ${(props) => (props.isSelected ? "white" : "#0fbcf9")};
  font-weight: bold;
`;
const BtnView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 10px 0px;
`;
const BtnText = styled.Text`
  margin-right: 5px;
  color: ${(props) => (props.status === props.buttonStatus ? "black" : "gray")};
`;

const UserHistory = () => {
  const [workComplete, setWorkComplete] = useState(true); //이용 완료
  const [working, setWorking] = useState(false); //이용중
  const [beforeWork, setBeforeWork] = useState(false); // 이용전
  const [status, setStatus] = useState("심부름 전");
  const changeStatus = (newStatus) => {
    setStatus(newStatus);
  };

  const historyWork = useRecoilValue(historyWorkData);

  //const chatRoomList = useRecoilValue(chatRoomListData);

  const [isHelepr, setIsHelper] = useState(true);

  const onPressHelper = () => {
    setIsHelper(true);
  };
  const onPressCustomer = () => {
    setIsHelper(false);
  };
  //console.log(historyWork);
  return (
    <View>
      <SelectView>
        <SelectBtn
          style={{
            borderBottomWidth: isHelepr ? 2 : 0,
          }}
          onPress={onPressHelper}
        >
          <SelectText>요청 받은 심부름</SelectText>
        </SelectBtn>
        <SelectBtn
          style={{
            borderBottomWidth: !isHelepr ? 2 : 0,
          }}
          onPress={onPressCustomer}
        >
          <SelectText>이용한 심부름</SelectText>
        </SelectBtn>
      </SelectView>

      <View style={{ paddingHorizontal: 20 }}>
        <BtnView>
          <StatusButton
            isSelected={status === "심부름 전"}
            underlayColor="#e0e0e0"
            onPress={() => changeStatus("심부름 전")}
          >
            <StatusButtonText isSelected={status === "심부름 전"}>
              심부름 전
            </StatusButtonText>
          </StatusButton>
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
        </BtnView>
        {isHelepr ? (
          <UserHelperHistory status={status} historyWork={historyWork} />
        ) : (
          <UserCustomerHistory status={status} historyWork={historyWork} />
        )}
      </View>
    </View>
  );
};
export default UserHistory;
