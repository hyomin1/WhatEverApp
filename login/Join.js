import axios from "axios";
import { useState } from "react";
import { Alert, View } from "react-native";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components/native";
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
const Button = styled.Pressable`
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
  const onPressJoin = () => {
    if (id === null) {
      Alert.alert("아이디를 입력해주세요");
    } else if (pw1 === null || pw2 === null) {
      Alert.alert("비밀번호를 입력해주세요");
    } else if (pw1 !== pw2) {
      Alert.alert("비밀번호가 동일하지 않습니다");
    } else {
      Alert.alert("회원가입 성공!"); //status 200 일때만
      setPw(pw1); //회원가입에 사용한 pw를 recoil에 저장
      axios
        .post("http://10.0.2.2:8080/join", {
          name: name,
          userId: id,
          password: pw1,
        })
        .then(function (res) {
          console.log("회원가입 성공");
          navigate("Login");
        })
        .catch((error) => {
          console.log(error);
        });
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
        <Button onPress={onPressJoin}>
          <ButtonText>완료</ButtonText>
        </Button>
      </JoinForm>
    </Container>
  );
};

export default Join;
