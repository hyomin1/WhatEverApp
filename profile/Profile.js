import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  TextInput,
} from "react-native";
import styled from "styled-components/native";
import { useEffect, useState } from "react";
import ProfileFix from "./ProfileFix";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  helperLocationData,
  myImgData,
  locationData,
  currentLocationData,
  userData,
  nameData,
  ratingData,
  IntroduceData,
  addressData,
} from "../atom";
import Postcode from "@actbase/react-daum-postcode";
import * as Location from "expo-location";
import axios from "axios";
import { BASE_URL } from "../api";
import ReviewModal from "../components/ReviewModal";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Config from "react-native-config";
import { Alert } from "react-native-web";
import WithDraw from "./WithDraw";

const Container = styled.ScrollView`
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

const EditButton = styled.TouchableOpacity`
  background-color: #0fbcf9;
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
  background-color: #0fbcf9;
  padding: 12px 20px;
  border-radius: 8px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  margin-left: 5px;
`;
const PostView = styled.View`
  flex-direction: row;
  padding: 20px 10px;
  align-items: center;
`;
const CloseIcon = styled(Ionicons)`
  flex: 1;
  color: black;
`;
const EmptyView = styled.View`
  flex: 1;
`;
const LocationInfo = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  color: #666;
  text-align: center;
`;
const MoneyText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;

  color: #666;
`;

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);

  const [latitude, setLatitude] = useState(); //서버에 지정한 위치 보내주기 위함
  const [longitude, setLongitude] = useState();

  const setLocation = useSetRecoilState(locationData);
  const setCurrentLocation = useSetRecoilState(currentLocationData);

  const myImg = useRecoilValue(myImgData);
  //const setHelperLocation = useSetRecoilState(helperLocationData);

  const [user, setUser] = useRecoilState(userData);
  const [review, setReview] = useState();
  const [visible, setVisible] = useState(false);

  const [address, setAddress] = useRecoilState(addressData);
  const [loc, setLoc] = useState();
  const [rewardModal, setRewardModal] = useState(false);
  const [reward, setReward] = useState();

  const API_KEY = Config.GOOGLE_MAPS_API_KEY;
  const goProfileFix = () => {
    setModalVisible(!modalVisible);
  };
  const onChangeReward = (payload) => {
    setReward(payload);
  };
  const onPressReward = async () => {
    if (reward >= 1000 && reward <= user.reward) {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/reward/transfer?amount=${reward}`
        );
        console.log("userreward", res.data);
        setUser(res.data);
      } catch (error) {
        Alert.alert(error.response.data.message);
      }
    }
  };

  const onPressReview = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/review`);
      setReview(res.data);
      setVisible(true);
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
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
            <Name>{user.name}</Name>
            {user.rating ? (
              <Text>⭐ {user.rating.toFixed(1)}/5</Text>
            ) : (
              <Text>⭐ 0/5</Text>
            )}
          </ProfileInfo>
        </ProfileHeader>
        {/**프로필 수정 UI*/}
        <ProfileFix
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          myImg={myImg}
          user={user}
          setUser={setUser}
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
      <ReviewModal visible={visible} setVisible={setVisible} review={review} />

      <Section>
        <SectionHeader>자기소개</SectionHeader>
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: "#666666",
            }}
          >
            {user.introduce === ""
              ? "작성된 자기소개가 없습니다"
              : user.introduce}
          </Text>
        </View>
      </Section>

      <Section>
        <SectionHeader>헬퍼 등록</SectionHeader>

        <ButtonContainer style={{ flexDirection: "column" }}>
          <Button onPress={() => setRegisterVisible(!registerVisible)}>
            <FontAwesome name="map-marker" size={24} color="red" />
            <ButtonText>내 위치 등록하기</ButtonText>
          </Button>
        </ButtonContainer>

        <Modal animationType="slide" visible={registerVisible}>
          <PostView>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setRegisterVisible(!registerVisible)}
            >
              <CloseIcon name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <EmptyView>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                내 위치 등록
              </Text>
            </EmptyView>
            <EmptyView />
          </PostView>
          <Postcode
            style={{ flex: 1, height: 250, marginBottom: 40 }}
            jsOptions={{ animation: true }}
            onSelected={async (data) => {
              try {
                const res1 = await axios.get(
                  `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${data.address}`,
                  {
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      "X-NCP-APIGW-API-KEY-ID": "sc8bw8njee",
                      "X-NCP-APIGW-API-KEY":
                        "bagOYXE2P7DmQR17nB9M3lNKoAt8e5CqnFTl7Hd8",
                    },
                  }
                );
                // console.log(res1.data);

                const res2 = await axios.put(`${BASE_URL}/api/userLocation`, {
                  latitude: res1.data.addresses[0].y,
                  longitude: res1.data.addresses[0].x,
                });
                console.log("2", res2.data);

                const { latitude, longitude } = res2.data;
                setLoc({ latitude, longitude });
                setCurrentLocation({ latitude, longitude });
                const res3 = await axios.get(
                  `https://nominatim.openstreetmap.org/reverse`,
                  {
                    params: {
                      format: "json",
                      lat: latitude,
                      lon: longitude,
                      "accept-language": "ko",
                    },
                  }
                );

                const { city, borough, quarter, road } = res3.data.address;
                setAddress({ city, borough, quarter, road });
                setRegisterVisible(!registerVisible);
              } catch (error) {
                Alert.alert(error);
              }
            }}
          />
        </Modal>
      </Section>
      <Section>
        <SectionHeader>헬퍼 활동 장소</SectionHeader>
        {address.city && address.borough && address.quarter && address.road ? (
          <LocationInfo>
            {address.city} {address.borough} {address.quarter} {address.road}
          </LocationInfo>
        ) : (
          <Text style={{ fontSize: 13, color: "#666666", textAlign: "center" }}>
            위치를 등록하고 헬퍼 활동을 시작해보세요
          </Text>
        )}
      </Section>
      <Section>
        <SectionHeader>리워드</SectionHeader>
        {/* {user.reward ? (
          <MoneyText>{user.reward}원</MoneyText>
        ) : (
          <MoneyText>0원</MoneyText>
        )} */}
        <MoneyText>{user.reward}원</MoneyText>
        <ButtonContainer>
          <Button onPress={() => setRewardModal(!rewardModal)}>
            <ButtonText>출금</ButtonText>
          </Button>
        </ButtonContainer>
        <WithDraw
          rewardModal={rewardModal}
          setRewardModal={setRewardModal}
          reward={user.reward}
        />
      </Section>
    </Container>
  );
};
export default Profile;
