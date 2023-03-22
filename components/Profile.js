import { View, Text, Image } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  background-color: white;
`;
const Box = styled.View`
  flex: 3;
`;
const MyProfile = styled.View`
  flex-direction: row;
  margin: 0px 15px;
  margin-top: 20px;
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

const Profile = () => {
  return (
    <Container>
      <Box>
        <MyProfile>
          <ProfileImg source={require("../images/profile.jpg")} />
          <View style={{ paddingVertical: 30 }}>
            <Name>이름</Name>
            <Text>⭐⭐⭐⭐⭐</Text>
          </View>
        </MyProfile>
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
