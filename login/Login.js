import { useState } from "react";
import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";

function Login({ navigation: { navigate } }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const onChangeId = (payload) => {
    setId(payload);
  };
  const onChangePw = (payload) => {
    setPassword(payload);
  };
  const onPressLogin = () => {
    if (id === "") {
      alert("아이디를 입력해주세요");
    } else if (password === "") {
      alert("비밀번호를 입력해주세요");
    } else {
      alert("Login!");
      navigate("Main");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.blank}></View>
      <View style={styles.title}>
        <Text style={styles.name}>WhatEver</Text>
        <Text style={styles.tinyText}>서비스 이용을 위해 로그인 해주세요.</Text>
      </View>
      <View style={styles.login}>
        <TextInput
          onChangeText={onChangeId}
          style={styles.input}
          placeholder="ID"
          value={id}
        />
        <TextInput
          onChangeText={onChangePw}
          value={password}
          style={styles.input}
          placeholder="Password"
          secureTextEntry
        />
        <Pressable onPress={onPressLogin} style={styles.button}>
          <Text style={styles.loginText}>로그인</Text>
        </Pressable>
        <View style={styles.line}></View>
        <Pressable style={styles.join}>
          <Text onPress={() => navigate("Join")} style={styles.joinText}>
            회원가입
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0fbcf9",
    flex: 1,
    paddingHorizontal: 80,
  },
  title: {
    flex: 1,
  },
  blank: {
    flex: 1,
  },
  login: {
    flex: 2,
  },
  name: {
    color: "white",
    fontWeight: "600",
    fontSize: 50,
  },
  tinyText: {
    color: "white",
    opacity: 0.8,
    fontWeight: "300",
  },
  input: {
    paddingHorizontal: 15,
    height: 40,
    backgroundColor: "white",
    borderRadius: 10,

    marginVertical: 5,
  },
  button: {
    paddingHorizontal: 15,
    height: 40,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  line: {
    borderBottomColor: "white",
    borderBottomWidth: 1,

    marginVertical: 10,
  },
  join: {
    alignItems: "center",
    justifyContent: "center",
  },
  joinText: {
    color: "white",
    opacity: 0.9,
    fontSize: 12,
  },
});
export default Login;
