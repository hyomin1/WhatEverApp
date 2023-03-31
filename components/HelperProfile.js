import { View, Text } from "react-native";
import styled from "styled-components/native";
const Button = styled.Pressable`
  padding: 0 15px;
  height: 40px;
  border-radius: 10px;
  margin: 5px 0;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
`;
const HelperProfile = () => {
  return (
    <View>
      <Text>헬퍼 프로필</Text>
      <Button>
        <Text>신청</Text>
      </Button>
    </View>
  );
};

export default HelperProfile;
