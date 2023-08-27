import { Modal, TouchableOpacity, Text, View } from "react-native";
import styled from "styled-components/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;
const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  background-color: white;
  height: 50px;
  padding: 0px 15px;
  border-bottom-width: 3px;
  border-bottom-color: #f5f5f5;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: black;
  flex: 1;
  text-align: center;
`;
const ProfileView = styled.View`
  background-color: white;
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
`;

const ProfileHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImg = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin-right: 20px;
`;

const ProfileInfo = styled.View``;

const Name = styled.Text`
  font-size: 24px;
  font-weight: 700;
`;
const ButtonContainer = styled.View`
  margin-top: 20px;
  flex-direction: row;
  justify-content: space-between;
`;
const EditButton = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 10px 20px;
  border-radius: 8px;
  align-self: flex-start;
  margin-top: 10px;
`;

const EditButtonText = styled.Text`
  color: white;
  font-weight: 600;
`;
const Section = styled.View`
  background-color: white;
  margin: 0 20px 20px;
  padding: 20px;
  border-radius: 10px;
`;

const SectionHeader = styled.Text`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
`;

const DetailUser = ({ userInfo, userVisible, setUserVisible }) => {
  console.log("우ㅠ저정보 전송", userInfo);

  return (
    <Modal
      style={{ flex: 1 }}
      animationType="slide"
      visible={userVisible}
      transparent
    >
      <Container>
        <TitleWrapper>
          <TouchableOpacity
            style={{
              flex: 1,
            }}
            onPress={() => {
              setUserVisible(false);
            }}
          >
            <Ionicons name="arrow-back" color="#333" size={24} />
          </TouchableOpacity>
          <Title>유저 정보</Title>
          <View style={{ flex: 1 }}></View>
        </TitleWrapper>
        <ProfileView>
          <ProfileHeader>
            <ProfileImg
              source={
                userInfo.image
                  ? { uri: `data:image/png;base64,${userInfo.image}` }
                  : require("../images/profile.jpg")
              }
            />
            <ProfileInfo>
              <Name>{userInfo.name}</Name>
              {userInfo.rating ? (
                <Text>⭐ {userInfo.rating.toFixed(1)}/5</Text>
              ) : (
                <Text>⭐ 0/5</Text>
              )}
            </ProfileInfo>
          </ProfileHeader>
          {/* <ButtonContainer>
            <EditButton>
              <EditButtonText></EditButtonText>
            </EditButton>
          </ButtonContainer> */}
        </ProfileView>
        <Section>
          <SectionHeader>유저 소개</SectionHeader>
          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#666" }}>
              {userInfo.introduce ? userInfo.introduce : "소개가 없습니다."}
            </Text>
          </View>
        </Section>
      </Container>
    </Modal>
  );
};
export default DetailUser;
