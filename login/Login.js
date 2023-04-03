import { useState } from "react";
import { View, Alert } from "react-native";
import styled from "styled-components/native";

import { accessData, grantData } from "../atom";
import { useRecoilState } from "recoil";
import { useNavigation } from "@react-navigation/native";
import { apiClient } from "../api";

const Container = styled.View`
  background-color: #0fbcf9;
  flex: 1;
  padding: 0 80px;
`;

const Title = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 50px;
`;
const TinyText = styled.Text`
  color: white;
  opacity: 0.8;
  font-weight: 300;
`;
const Input = styled.TextInput`
  padding: 0 15px;
  height: 40px;
  background-color: white;
  border-radius: 10px;
  margin: 5px 0;
`;
const Button = styled.Pressable`
  padding: 0 15px;
  height: 40px;
  border-radius: 10px;
  margin: 5px 0;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
`;
const LoginText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;
const Line = styled.View`
  border-bottom-color: white;
  border-bottom-width: 1px;
  margin: 10px 0;
`;
const JoinBtn = styled.Pressable`
  align-items: center;
  justify-content: center;
`;
const JoinText = styled.Text`
  color: white;
  opacity: 0.9;
  font-size: 15px;
  font-weight: 600;
`;

function Login({ navigation: { navigate } }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [access, setAccess] = useRecoilState(accessData);
  const [grant, setGrant] = useRecoilState(grantData);
  const onChangeId = (payload) => {
    setId(payload);
  };
  const onChangePw = (payload) => {
    setPassword(payload);
  };
  const navigation = useNavigation();
  const goMain = () => {
    navigation.navigate("Tabs", { screen: "Main" });
  };

  const sendLogin = async () => {
    try {
      const res = await apiClient.post("/login", {
        userId: id,
        password: password,
      });

      setAccess(res.data.accessToken);
      setGrant(res.data.grantType);
      Alert.alert("로그인 완료");
      console.log("로그인 성공");
      goMain();
    } catch (error) {
      if (error.response.status === 403) {
        Alert.alert("아이디 비밀번호를 확인해주세요");
      }
      console.log(error); //code 403 -> 아이디,비번 오류
    }
  };
  const onPressLogin = () => {
    if (id === "") {
      Alert.alert("아이디를 입력해주세요");
    } else if (password === "") {
      Alert.alert("비밀번호를 입력해주세요");
    } else {
      sendLogin();
    }
  };

  return (
    <Container>
      <View style={{ flex: 1 }}></View>
      <View style={{ flex: 1 }}>
        <Title>WhatEver</Title>
        <TinyText>서비스 이용을 위해 로그인 해주세요.</TinyText>
      </View>
      <View style={{ flex: 2 }}>
        <Input onChangeText={onChangeId} placeholder="ID" value={id} />
        <Input
          onChangeText={onChangePw}
          value={password}
          placeholder="Password"
          secureTextEntry
        />
        <Button onPress={onPressLogin}>
          <LoginText>로그인</LoginText>
        </Button>
        <Line />
        <JoinBtn>
          <JoinText onPress={() => navigate("Join")}>회원가입</JoinText>
        </JoinBtn>
      </View>
    </Container>
  );
}

export default Login;
