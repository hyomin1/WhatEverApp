import axios from "axios";
import styled from "styled-components/native";
import { BASE_URL } from "../api";
import { View, Text } from "react-native";
import { useRecoilValue } from "recoil";
import { adminTokenData } from "../atom";
import { useState } from "react";
import PunishmentModal from "./PunishmentModal";

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
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
const ButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
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

const AdminUserView = ({ route }) => {
  const { user } = route.params;

  const adminToken = useRecoilValue(adminTokenData);
  const [punishmentLogs, setPunishmentLogs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const openModal = () => {
    setIsModalVisible(true);
    // Call the getPunishmentLogs function here to fetch data
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const getPunishmentLogs = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/punishReportList/${user.id}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      setPunishmentLogs(res.data); //처벌 기록 데이터
      openModal();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container>
      <ProfileView>
        <ProfileHeader>
          <ProfileImg
            source={
              user.image
                ? { uri: `data:image/png;base64,${user.image}` }
                : require("../images/profile.jpg")
            }
          />
          <ProfileInfo>
            <Name>{user.name}</Name>
            {route.params.rating ? (
              <Text>⭐ {route.params.rating.toFixed(1)}/5</Text>
            ) : (
              <Text>⭐ 0/5</Text>
            )}
          </ProfileInfo>
        </ProfileHeader>
      </ProfileView>

      <Section>
        <SectionHeader>유저 소개</SectionHeader>
        <View>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#888" }}>
            {user.introduce === null ? "유저 소개가 없습니다" : user.introduce}
          </Text>
        </View>
      </Section>
      <ButtonsContainer>
        <EditButton onPress={getPunishmentLogs}>
          <EditButtonText>처벌 기록 보기</EditButtonText>
        </EditButton>
      </ButtonsContainer>
      <PunishmentModal
        isVisible={isModalVisible}
        data={punishmentLogs} // Pass your fetched data here
        onClose={closeModal}
      />
    </Container>
  );
};

export default AdminUserView;
