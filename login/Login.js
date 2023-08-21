import { useState } from "react";
import { View, Alert, Text } from "react-native";
import styled from "styled-components/native";

import { accessData, grantData, myIdData, adminData } from "../atom";
import { useSetRecoilState } from "recoil";
import { useNavigation } from "@react-navigation/native";
import { apiClient, BASE_URL } from "../api";
import axios from "axios";

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
const Button = styled.TouchableOpacity`
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
const JoinBtn = styled.TouchableOpacity`
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

  const setAccess = useSetRecoilState(accessData);
  const setGrant = useSetRecoilState(grantData);

  const setMyId = useSetRecoilState(myIdData);

  const setIsAdmin = useSetRecoilState(adminData);

  //const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);

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
  //유저 로그인시 비번,아이디 이상 없을 경우 실행
  const sendLogin = async () => {
    axios
      .post(`${BASE_URL}/login`, {
        userId: id,
        password,
      })
      .then((res) => {
        setAccess(res.data.accessToken);
        setGrant(res.data.grantType);
        setMyId(res.data.id);

        if (res.status === 200) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.accessToken}`;
          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.accessToken}`;
        }

        setIsAdmin(false);
        goMain();
      })
      .catch((error) => Alert.alert(error.response.data.message));
  };
  //유저 로그인
  const onPressLogin = () => {
    if (id === "") {
      Alert.alert("아이디를 입력해주세요");
    } else if (password === "") {
      Alert.alert("비밀번호를 입력해주세요");
    } else {
      sendLogin();
    }
  };
  //어드민 로그인
  const onPressAdmin = () => {
    setIsAdmin(true);
    goMain();
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
        <JoinBtn onPress={onPressAdmin}>
          <Text style={{ color: "white" }}>관리자 로그인</Text>
        </JoinBtn>
        <Line />
        <JoinBtn onPress={() => navigate("Join")}>
          <JoinText>회원가입</JoinText>
        </JoinBtn>
      </View>
    </Container>
  );
}

export default Login;
