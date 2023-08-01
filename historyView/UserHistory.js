import { useState } from "react";
import styled from "styled-components/native";
import { Pressable, View, Text } from "react-native";

import { useRecoilValue } from "recoil";
import { historyWorkData } from "../atom";
import UserCustomerHistory from "./UserCustomerHistory";
import UserHelperHistory from "./UserHelperHistory";

const SelectView = styled.View`
  flex: 1;
  flex-direction: row;
  margin-bottom: 10px;
`;
const SelectBtn = styled.Pressable`
  background-color: white;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-bottom-width: 2px;
`;
const SelectText = styled.Text`
  color: black;
`;

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
  const [working, setWorking] = useState(false); //이용중
  const [beforeWork, setBeforeWork] = useState(false); // 이용전

  const historyWork = useRecoilValue(historyWorkData);

  //const chatRoomList = useRecoilValue(chatRoomListData);

  const [isHelepr, setIsHelper] = useState(true);

  const onPressHelper = () => {
    setIsHelper(true);
  };
  const onPressCustomer = () => {
    setIsHelper(false);
  };

  return (
    <View>
      <SelectView>
        <SelectBtn
          style={{ borderBottomWidth: isHelepr ? 2 : 0 }}
          onPress={onPressHelper}
        >
          <SelectText>요청 받은 심부름</SelectText>
        </SelectBtn>
        <SelectBtn
          style={{ borderBottomWidth: !isHelepr ? 2 : 0 }}
          onPress={onPressCustomer}
        >
          <SelectText>이용한 심부름</SelectText>
        </SelectBtn>
      </SelectView>
      <View style={{ paddingHorizontal: 20 }}>
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
        {isHelepr ? (
          <UserHelperHistory
            isHelepr={isHelepr}
            workComplete={workComplete}
            working={working}
            beforeWork={beforeWork}
          />
        ) : (
          <UserCustomerHistory
            isHelepr={isHelepr}
            workComplete={workComplete}
            working={working}
            beforeWork={beforeWork}
          />
        )}
      </View>
    </View>
  );
};
export default UserHistory;