import axios from "axios";
import { useState } from "react";
import { Alert, View } from "react-native";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components/native";
import { api, apiClient, BASE_URL } from "../api";
import { idData, nameData, pwData } from "../atom";

const Container = styled.View`
  flex: 1;
  background-color: #0fbcf9;
  padding: 120px 60px;
`;
const JoinText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 28px;
`;
const JoinForm = styled.View``;
const FormText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin: 5px 0;
`;
const Input = styled.TextInput`
  padding: 0px 15px;
  height: 45px;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 5px;
`;
const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const Button = styled.TouchableOpacity`
  padding: 0px 15px;
  height: 45px;
  background-color: white;
  border-radius: 10px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
`;
const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

const Join = ({ navigation: { navigate } }) => {
  const [name, setName] = useRecoilState(nameData);
  const [id, setId] = useRecoilState(idData);
  const setPw = useSetRecoilState(pwData); //비밀번호 두개 일치 할경우 recoil pw에 저장

  const [pw1, setPw1] = useState(null); //비밀번호
  const [pw2, setPw2] = useState(null); //비밀번호 확인

  const onChangeName = (payload) => {
    setName(payload);
  };
  const onChangeId = (payload) => {
    setId(payload);
  };
  const onChangePw = (payload) => {
    setPw1(payload);
  };
  const onChangePw2 = (payload) => {
    setPw2(payload);
  };
  const sendJoin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/join`, {
        name: name,
        userId: id,
        password: pw1,
      });
      Alert.alert("회원가입 성공");
      console.log("회원가입 성공");
      navigate("Login");
    } catch (error) {
      console.log(error);
    }
  };
  const onPressJoin = () => {
    if (id === null) {
      Alert.alert("아이디를 입력해주세요");
    } else if (pw1 === null || pw2 === null) {
      Alert.alert("비밀번호를 입력해주세요");
    } else if (pw1 !== pw2) {
      Alert.alert("비밀번호가 동일하지 않습니다");
    } //else if (pw1.length < 8 || pw2.length < 8) {
    //Alert.alert("8자 이상 입력해주세요.");
    //}
    else {
      setPw(pw1);
      sendJoin();
    }
  };
  return (
    <Container>
      <View style={{ marginBottom: 20 }}>
        <JoinText>회원가입</JoinText>
      </View>
      <JoinForm>
        <FormText>이름</FormText>
        <Input
          placeholder="이름"
          onChangeText={onChangeName}
          returnKeyType="next"
        />
        <FormText>ID</FormText>
        <Input
          placeholder="영문 3자 이상"
          onChangeText={onChangeId}
          returnKeyType="next"
        />
        <FormText>Password</FormText>
        <Input
          placeholder="8자 이상"
          secureTextEntry
          onChangeText={onChangePw}
          returnKeyType="next"
        />
        <FormText>Confirm Password</FormText>
        <Input
          placeholder="8자 이상"
          secureTextEntry
          onChangeText={onChangePw2}
        />
        <ButtonContainer>
          <Button onPress={() => navigate("Login")}>
            <ButtonText>돌아가기</ButtonText>
          </Button>
          <Button onPress={onPressJoin}>
            <ButtonText>완료</ButtonText>
          </Button>
        </ButtonContainer>
      </JoinForm>
    </Container>
  );
};

export default Join;
