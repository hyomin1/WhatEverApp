import { View, Text, TextInput, Pressable } from "react-native";

const AdminLogin = ({ navigation: { navigate } }) => {
  const onPressLogin = () => {
    navigate("AdminView");
  };

  return (
    <View>
      <TextInput placeholder="아이디" />
      <TextInput placeholder="비밀번호" />
      <Pressable onPress={onPressLogin}>
        <Text>로그인</Text>
      </Pressable>
    </View>
  );
};

export default AdminLogin;
