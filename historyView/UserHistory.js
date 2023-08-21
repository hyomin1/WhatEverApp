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
  background-color: white;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-bottom-width: 2px;
  border: 0.8px solid lightgray;
`;
const SelectText = styled.Text`
  color: black;
`;
const TouchableCustom = styled.TouchableHighlight`
  //padding: 5px 10px;
  border-radius: 10px;
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
            borderBottomColor: "black",
            borderBottomWidth: isHelepr ? 2 : 0,
          }}
          onPress={onPressHelper}
        >
          <SelectText>요청 받은 심부름</SelectText>
        </SelectBtn>
        <SelectBtn
          style={{
            borderBottomColor: "black",
            borderBottomWidth: !isHelepr ? 2 : 0,
          }}
          onPress={onPressCustomer}
        >
          <SelectText>이용한 심부름</SelectText>
        </SelectBtn>
      </SelectView>

      <View style={{ paddingHorizontal: 20 }}>
        <BtnView>
          <TouchableCustom
            status={status}
            buttonStatus="심부름 전"
            underlayColor="#e0e0e0"
            onPress={() => changeStatus("심부름 전")}
          >
            <BtnText status={status} buttonStatus="심부름 전">
              심부름 전
            </BtnText>
          </TouchableCustom>
          <TouchableCustom
            status={status}
            buttonStatus="심부름 중"
            underlayColor="#e0e0e0"
            onPress={() => changeStatus("심부름 중")}
          >
            <BtnText status={status} buttonStatus="심부름 중">
              심부름 중
            </BtnText>
          </TouchableCustom>
          {isHelepr ? null : (
            <TouchableCustom
              status={status}
              buttonStatus="심부름 완료"
              underlayColor="#e0e0e0"
              onPress={() => changeStatus("심부름 완료")}
            >
              <BtnText status={status} buttonStatus="심부름 완료">
                심부름 완료
              </BtnText>
            </TouchableCustom>
          )}
        </BtnView>
        {isHelepr ? (
          <UserHelperHistory />
        ) : (
          <UserCustomerHistory status={status} historyWork={historyWork} />
        )}
      </View>
    </View>
  );
};
export default UserHistory;
