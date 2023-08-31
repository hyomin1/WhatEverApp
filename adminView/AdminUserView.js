import axios from "axios";
import styled from "styled-components/native";
import { BASE_URL } from "../api";

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
const getPunishmentLogs = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/admin/punishReportList/${userid}`
    );
    console.log(res.data); //처벌 기록 데이터
  } catch (error) {
    console.log(error);
  }
};
const AdminUserView = () => {
  return (
    <Container>
      <ProfileView>
        <ProfileHeader>
          <ProfileImg />
          <ProfileInfo>
            <Name>a2</Name>
            {/* 별점 추가 */}
          </ProfileInfo>
        </ProfileHeader>
      </ProfileView>

      <Section>
        <SectionHeader>유저 소개</SectionHeader>
      </Section>
      <ButtonsContainer>
        <EditButton onPress={getPunishmentLogs}>
          <EditButtonText>처벌 기록 보기</EditButtonText>
        </EditButton>
      </ButtonsContainer>
    </Container>
  );
};

export default AdminUserView;
