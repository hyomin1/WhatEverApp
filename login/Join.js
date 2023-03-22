import { useState } from "react";
import { Alert, View } from "react-native";
import styled from "styled-components/native";

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
  const [name, setName] = useState(null);
  const [id, setId] = useState(null);
  const [pw, setPw] = useState(null);
  const [pw2, setPw2] = useState(null);
  const onChangeName = (payload) => {
    setName(name);
  };
  const onChangeId = (payload) => {
    setId(payload);
  };
  const onChangePw = (payload) => {
    setPw(payload);
  };
  const onChangePw2 = (payload) => {
    setPw2(payload);
  };
  const onPressJoin = () => {
    if (id === null) {
      Alert.alert("아이디를 입력해주세요");
    } else if (pw === null || pw2 === null) {
      Alert.alert("비밀번호를 입력해주세요");
    } else if (pw !== pw2) {
      Alert.alert("비밀번호가 동일하지 않습니다");
    } else {
      Alert.alert("회원가입 성공!");
      navigate("Login");
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
          value={name}
          onChangeText={onChangeName}
          returnKeyType="next"
        />
        <FormText>ID</FormText>
        <Input
          placeholder="영문 3자 이상"
          value={id}
          onChangeText={onChangeId}
          returnKeyType="next"
        />
        <FormText>Password</FormText>
        <Input
          placeholder="8자 이상"
          secureTextEntry
          value={pw}
          onChangeText={onChangePw}
          returnKeyType="next"
        />
        <FormText>Confirm Password</FormText>
        <Input
          placeholder="8자 이상"
          secureTextEntry
          value={pw}
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
