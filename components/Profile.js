import { View, Text, TextInput } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Fix from "./Fix";
import { useRecoilValue } from "recoil";
import { imgData, nameData } from "../atom";

const Container = styled.View`
  flex: 1;
  background-color: white;
`;
const Box = styled.View`
  flex: 3;
`;
const MyProfile = styled.View`
  flex-direction: row;
  margin: 20px 15px;
`;
const ProfileImg = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-right: 20px;
`;
const Name = styled.Text`
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: 800;
`;

const ProfileBtn = styled.Pressable`
  padding: 0 15px;
  height: 40px;
  margin: 5px 20px;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
`;
const ProfileText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 15px;
`;

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const img = useRecoilValue(imgData);
  const navigation = useNavigation();
  const goFix = () => {
    setModalVisible(!modalVisible);
  };
  const name = useRecoilValue(nameData);
  return (
    <Container>
      <Box>
        <MyProfile>
          <ProfileImg source={{ uri: img }} />
          <View style={{ paddingVertical: 20 }}>
            <Name>{name}</Name>
            <Text>⭐ 3.7/5</Text>
          </View>
        </MyProfile>
        <Fix setModalVisible={setModalVisible} modalVisible={modalVisible} />
        <ProfileBtn onPress={goFix}>
          <ProfileText>회원정보 수정</ProfileText>
        </ProfileBtn>

        <TextInput />
      </Box>
      <Box>
        <Text>2</Text>
      </Box>
      <Box>
        <Text>3</Text>
      </Box>
    </Container>
  );
};
export default Profile;
