import { View, Text, TextInput, Pressable, Modal } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import ProfileFix from "./ProfileFix";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  IntroduceData,
  helperLocationData,
  myImgData,
  nameData,
  ratingData,
  locationData,
  currentLocationData,
} from "../atom";
import Postcode from "@actbase/react-daum-postcode";
import * as Location from "expo-location";
import axios from "axios";
import { BASE_URL } from "../api";

const Container = styled.ScrollView`
  flex: 1;
  background-color: #f5f5f5;
`;

const ProfileView = styled.View`
  background-color: white;
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
  /* shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 5; */
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

const RatingText = styled.Text`
  font-size: 16px;
  color: #666;
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

const ButtonContainer = styled.View`
  margin-top: 20px;
  flex-direction: row;
  justify-content: space-between;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  background-color: #3498db;
  padding: 12px 20px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
`;
const CountBox = styled.View`
  padding: 0 20px;
  margin-top: 20px;
`;

const CountContainer = styled.View`
  border-radius: 10px;
  background-color: #f5f5f5;
  padding: 15px 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const CountText = styled.Text`
  font-size: 16px;
  font-weight: 800;
`;

const CountValue = styled.Text`
  font-size: 16px;
`;

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);

  const [latitude, setLatitude] = useState(); //서버에 지정한 위치 보내주기 위함
  const [longitude, setLongitude] = useState();

  const [location, setLocation] = useRecoilState(locationData);
  const setCurrentLocation = useSetRecoilState(currentLocationData);

  const myImg = useRecoilValue(myImgData);
  const rating = useRecoilValue(ratingData);
  const setHelperLocation = useSetRecoilState(helperLocationData);
  const name = useRecoilValue(nameData);
  const introduce = useRecoilValue(IntroduceData);

  const goProfileFix = () => {
    setModalVisible(!modalVisible);
  };
  const onPressReview = () => {
    axios
      .get(`${BASE_URL}/api/review`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => console.log(e));
  };

  return (
    <Container>
      <ProfileView>
        <ProfileHeader>
          <ProfileImg
            source={
              myImg
                ? { uri: `data:image/png;base64,${myImg}` }
                : require("../images/profile.jpg")
            }
          />
          <ProfileInfo style={{ paddingVertical: 20 }}>
            <Name>{name}</Name>
            {rating ? <Text>⭐ {rating.toFixed(1)}/5</Text> : <Text>⭐</Text>}
          </ProfileInfo>
        </ProfileHeader>
        {/**프로필 수정 UI*/}
        <ProfileFix
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          myImg={myImg}
        />

        <ButtonContainer>
          <EditButton onPress={goProfileFix}>
            <EditButtonText>회원정보 수정</EditButtonText>
          </EditButton>
          <EditButton onPress={onPressReview}>
            <EditButtonText>리뷰 보기</EditButtonText>
          </EditButton>
        </ButtonContainer>
      </ProfileView>

      <Section>
        <SectionHeader>자기소개</SectionHeader>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "400" }}>{introduce}</Text>
        </View>
      </Section>

      <Section>
        <SectionHeader>요청 정보</SectionHeader>
        <CountBox>
          <CountContainer>
            <CountText>총 심부름 수</CountText>
            <CountValue>0</CountValue>
          </CountContainer>
          <CountContainer>
            <CountText>요청한 심부름 수</CountText>
            <CountValue>0</CountValue>
          </CountContainer>
        </CountBox>
      </Section>

      <Section>
        <SectionHeader>헬퍼 등록</SectionHeader>
        <ButtonContainer>
          <Button onPress={() => setRegisterVisible(!registerVisible)}>
            <ButtonText>내 위치 등록하기</ButtonText>
          </Button>
        </ButtonContainer>

        <Modal animationType="slide" visible={registerVisible}>
          <Postcode
            style={{ flex: 1, height: 250, marginBottom: 40 }}
            jsOptions={{ animation: true }}
            onSelected={async (data) => {
              const location = await Location.geocodeAsync(data.query);
              setLatitude(location[0].latitude); //여기서 location[0].latitude 바로 보내주면됨
              setLongitude(location[0].longitude);

              setRegisterVisible(!registerVisible);

              axios
                .put("http://10.0.2.2:8080/api/userLocation", {
                  latitude: location[0].latitude,
                  longitude: location[0].longitude,
                })
                .then(({ data: { latitude, longitude } }) => {
                  setLocation({ latitude, longitude });
                  setCurrentLocation({ latitude, longitude });
                });
            }}
          />
        </Modal>
      </Section>
    </Container>
  );
};
export default Profile;
