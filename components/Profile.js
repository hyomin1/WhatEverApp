import { View, Text, TextInput } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Fix from "./Fix";
import { useRecoilValue } from "recoil";
import { imgData, IntroduceData, nameData, ratingData } from "../atom";
import { Entypo } from "@expo/vector-icons";

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
const Line = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 0.5px;
  margin: 10px 0;
`;
const ContentBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 0 20px;
  margin-bottom: 30px;
`;
const ContentText = styled.Text`
  font-size: 18px;
  font-weight: 600;
`;
const Count = styled.View`
  padding: 0px 20px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border: 1px solid rgba(0, 0, 0, 0.5);
`;
const CountText = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [introduceVisible, setIntroduceVisible] = useState(false);

  const img = useRecoilValue(imgData);
  const rating = useRecoilValue(ratingData);

  const goFix = () => {
    setModalVisible(!modalVisible);
  };

  const name = useRecoilValue(nameData);
  const introduce = useRecoilValue(IntroduceData);
  return (
    <Container>
      <Box>
        <MyProfile>
          <ProfileImg source={{ uri: img }} />
          <View style={{ paddingVertical: 20 }}>
            <Name>{name}</Name>
            {rating ? <Text>⭐ {rating.toFixed(1)}/5</Text> : <Text>⭐</Text>}
          </View>
        </MyProfile>
        <Fix setModalVisible={setModalVisible} modalVisible={modalVisible} />
        <ProfileBtn onPress={goFix}>
          <ProfileText>회원정보 수정</ProfileText>
        </ProfileBtn>
        <Line />
      </Box>
      <Box>
        <ContentBox>
          <ContentText>자기소개</ContentText>
        </ContentBox>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>{introduce}</Text>
        </View>
      </Box>
      <Box>
        <ContentBox>
          <ContentText>요청정보</ContentText>
        </ContentBox>
        <View style={{ paddingHorizontal: 20 }}>
          <Count>
            <CountText>총 심부름수</CountText>
            <Text>0</Text>
          </Count>
          <Count>
            <CountText>요청한 심부름 수</CountText>
            <Text>0</Text>
          </Count>
        </View>
      </Box>
    </Container>
  );
};
export default Profile;
