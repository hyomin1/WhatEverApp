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
  background-color: blue;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 40px;
  border: 1px solid black;
`;
const SelectText = styled.Text``;

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

  //const chatRoomList = useRecoilValue(chatRoomListData);

  const [isHelepr, setIsHelper] = useState(true);

  const onPressHelper = () => {
    console.log("헬퍼 ");
    setIsHelper(true);
  };
  const onPressCustomer = () => {
    console.log("고객");
    setIsHelper(false);
  };

  return (
    <View>
      <SelectView>
        <SelectBtn onPress={onPressHelper}>
          <SelectText style={{ color: isHelepr ? "white" : "black" }}>
            요청 받은 심부름
          </SelectText>
        </SelectBtn>
        <SelectBtn onPress={onPressCustomer}>
          <SelectText style={{ color: !isHelepr ? "white" : "black" }}>
            이용한 심부름
          </SelectText>
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
