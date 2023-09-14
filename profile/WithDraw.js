import React, { useState } from "react";
import styled from "styled-components/native";
import Modal from "react-native-modal";
import { Alert, View } from "react-native";

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  width: 80%;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
`;

const RewardText = styled.Text`
  font-size: 19px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
`;

const InputField = styled.TextInput`
  border-width: 1px;
  border-color: gray;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  margin-bottom: 20px;
`;

const WithdrawButton = styled.TouchableOpacity`
  background-color: #0fbcf9;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
`;

const WithdrawButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const Withdraw = ({ rewardModal, setRewardModal, reward }) => {
  const [rewardInput, setRewardInput] = useState("");

  const toggleRewardModal = () => {
    setRewardModal(!rewardModal);
    setRewardInput("");
  };

  const handleRewardChange = (text) => {
    // 입력값이 최대 금액보다 크면 최대 금액으로 설정
    if (Number(text) > reward) {
      setRewardInput(reward.toString());
    } else {
      setRewardInput(text);
    }
  };

  const onPressReward = async () => {
    if (reward >= 1000 && rewardInput <= reward) {
      // 출금 로직 구현
      try {
        const res = await axios.get(
          `${BASE_URL}/api/reward/transfer?amount=${rewardInput}`
        );
        console.log("userreward", res.data);
        setUser(res.data);
      } catch (error) {
        Alert.alert(error.response.data.message);
      }
    }
  };

  return (
    <Modal
      isVisible={rewardModal}
      onBackdropPress={toggleRewardModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver={true}
    >
      <ModalContainer>
        <ModalContent>
          {/* {reward ? (
            <RewardText>최대 출금 금액: {reward}원</RewardText>
          ) : (
            <RewardText>최대 출금 금액: 0원</RewardText>
          )} */}
          <RewardText>출금 가능 금액 : {reward}원</RewardText>
          <InputField
            placeholder="출금할 금액을 입력해주세요"
            onChangeText={handleRewardChange}
            value={rewardInput}
            keyboardType="numeric"
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <WithdrawButton onPress={onPressReward}>
              <WithdrawButtonText>출금하기</WithdrawButtonText>
            </WithdrawButton>
            <WithdrawButton onPress={toggleRewardModal}>
              <WithdrawButtonText>닫기</WithdrawButtonText>
            </WithdrawButton>
          </View>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default Withdraw;
