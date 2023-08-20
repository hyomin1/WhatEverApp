import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import { useEffect, useState } from "react";
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
import ReviewModal from "../components/ReviewModal";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Config from "react-native-config";

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
  const [visible, setVisible] = useState(false);
  const [address, setAddress] = useState({
    city: "",
    borough: "",
    quarter: "",
    road: "",
  });

  const API_KEY = Config.GOOGLE_MAPS_API_KEY;
  const goProfileFix = () => {
    setModalVisible(!modalVisible);
  };
  const onPressReview = () => {
    setVisible(true);
    // axios
    //   .get(`${BASE_URL}/api/review`)
    //   .then((res) => {
    //     console.log(res.data);
    //   })
    //   .catch((e) => console.log(e));
  };
  const reviews = [
    {
      text: "good",
      date: "1.5",
    },
    {
      text: "bad",
      date: "2.5",
    },
  ];
  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) console.log("내 정보 현 위치 에러");
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    try {
      const res = await axios.get(
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
      const { city, borough, quarter, road } = res.data.address;

      setAddress({
        city,
        borough,
        quarter,
        road,
      });
    } catch (error) {
      console.log(error);
    }

    setLatitude(latitude);
    setLongitude(longitude);
  };
  useEffect(() => {
    getLocation();
  }, []);

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
      <ReviewModal
        visible={visible}
        setVisible={setVisible}
        reviews={reviews}
      />

      <Section>
        <SectionHeader>자기소개</SectionHeader>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "400" }}>{introduce}</Text>
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
              const location = await Location.geocodeAsync(data.query);
              setLatitude(location[0].latitude); //여기서 location[0].latitude 바로 보내주면됨
              setLongitude(location[0].longitude);
              setRegisterVisible(!registerVisible);
              axios
                .put("http://10.0.2.2:8080/api/userLocation", {
                  latitude: location[0].latitude,
                  longitude: location[0].longitude,
                })
                .then(async ({ data: { latitude, longitude } }) => {
                  setLocation({ latitude, longitude });
                  setCurrentLocation({ latitude, longitude });
                  await axios
                    .get(`https://nominatim.openstreetmap.org/reverse`, {
                      params: {
                        format: "json",
                        lat: latitude,
                        lon: longitude,
                        "accept-language": "ko",
                      },
                    })
                    .then((res) => {
                      const { city, borough, quarter, road } = res.data.address;
                      setAddress({
                        city,
                        borough,
                        quarter,
                        road,
                      });
                    });
                });
            }}
          />
        </Modal>
      </Section>
      <Section>
        <SectionHeader>현 위치</SectionHeader>
        <LocationInfo>
          {address.city} {address.borough} {address.quarter} {address.road}
        </LocationInfo>
      </Section>
    </Container>
  );
};
export default Profile;
