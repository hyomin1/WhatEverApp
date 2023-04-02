import { View, Text, Pressable } from "react-native";
import { useRecoilValue } from "recoil";
import styled from "styled-components/native";
import { accessData, contentData, grantData, imgData } from "../atom";
import axios from "axios";
const Container = styled.View`
  flex: 1;
  background-color: white;
`;
const Box = styled.View`
  flex: 1;
`;
const MyProfile = styled.View`
  flex-direction: row;
  margin: 0 10px;
  border-bottom-color: black;
  border-bottom-width: 0.5px;
  padding: 10px 0;
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

const ContentBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 20px 20px;
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
const Button = styled.Pressable`
  padding: 0 15px;
  height: 40px;
  border-radius: 10px;
  margin: 5px 0;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
`;
const HelperProfile = ({ navigation, route }) => {
  const img = useRecoilValue(imgData);
  const access = useRecoilValue(accessData);
  const grant = useRecoilValue(grantData);
  const onPressBtn = () => {
    axios
      .post(
        "http://10.0.2.2:8080/api/conversation/1",
        {},
        {
          headers: { Authorization: `${grant}` + " " + `${access}` },
        }
      )
      .then((res) => console.log(res.data))
      .catch((error) => console.log(error));
  };
  return (
    <Container>
      <Box>
        <MyProfile>
          <ProfileImg source={{ uri: img }} />
          <View style={{ paddingVertical: 20 }}>
            <Name>{route.params.name}</Name>
            {route.params.rating ? (
              <Text>⭐ {route.params.rating.toFixed(1)}/5</Text>
            ) : (
              <Text>⭐ 0/5</Text>
            )}
          </View>
        </MyProfile>
        <ContentBox>
          <ContentText>헬퍼소개</ContentText>
        </ContentBox>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {route.params.introduce}
          </Text>
        </View>
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
        <Button onPress={onPressBtn}>
          <Text>신청</Text>
        </Button>
      </Box>
    </Container>
  );
};

export default HelperProfile;