import { View, Text, TextInput, Pressable, Modal } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import ProfileFix from "./ProfileFix";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  IntroduceData,
  helperLocationData,
  myImgData,
  nameData,
  ratingData,
} from "../atom";
import Postcode from "@actbase/react-daum-postcode";
import * as Location from "expo-location";
import axios from "axios";

const Container = styled.ScrollView`
  flex: 1;
  background-color: white;
`;
const Box = styled.View`
  flex: 3;
  margin-bottom: 100px;
`;
const MyProfile = styled.View`
  flex-direction: row;
  margin: 20px 15px;
`;
const ProfileImg = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin-right: 20px;
`;
const Name = styled.Text`
  margin-bottom: 5px;
  font-size: 23px;
  font-weight: 800;
`;
const ProfileBtn = styled.Pressable`
  padding: 0 15px;
  height: 40px;
  margin: 5px 20px;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
  border-radius: 5px;
`;
const ProfileText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 15px;
`;
const Line = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 0.5px;
  margin-top: 10px;
`;
const ContentBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 20px 20px;
`;
const CountBox = styled.View`
  padding: 0 20px;
`;
const ContentText = styled.Text`
  font-size: 17px;
  font-weight: 600;
`;
const Count = styled.View`
  padding: 0px 20px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border: 2px solid rgba(0, 0, 0, 0.5);
`;
const Count1 = styled(Count)`
  border-radius: 10px;
`;
const Count2 = styled(Count)`
  border-radius: 10px;
`;
const CountText = styled.Text`
  font-size: 16px;
  font-weight: 800;
`;
const BlankBox = styled.View`
  background-color: #dcdde1;
  width: 100%;
  height: 6px;
`;

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);

  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const myImg = useRecoilValue(myImgData);
  const rating = useRecoilValue(ratingData);
  const setHelperLocation = useSetRecoilState(helperLocationData);

  const goProfileFix = () => {
    setModalVisible(!modalVisible);
  };

  const name = useRecoilValue(nameData);
  const introduce = useRecoilValue(IntroduceData);
  return (
    <Container>
      <View>
        <MyProfile>
          <ProfileImg
            source={
              myImg
                ? { uri: `data:image/png;base64,${myImg}` }
                : require("../images/profile.jpg")
            }
          />
          <View style={{ paddingVertical: 20 }}>
            <Name>{name}</Name>
            {rating ? <Text>⭐ {rating.toFixed(1)}/5</Text> : <Text>⭐</Text>}
          </View>
        </MyProfile>
        {/**프로필 수정 UI*/}
        <ProfileFix
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          myImg={myImg}
        />
        <ProfileBtn onPress={goProfileFix}>
          <ProfileText>회원정보 수정</ProfileText>
        </ProfileBtn>
        <Line />
      </View>
      <Box>
        <ContentBox>
          <ContentText>자기소개</ContentText>
        </ContentBox>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "400" }}>{introduce}</Text>
        </View>
      </Box>
      <BlankBox></BlankBox>
      <Box>
        <ContentBox>
          <ContentText>요청정보</ContentText>
        </ContentBox>
        <CountBox>
          <Count1>
            <CountText>총 심부름수</CountText>
            <Text>0</Text>
          </Count1>
          <Count2>
            <CountText>요청한 심부름 수</CountText>
            <Text>0</Text>
          </Count2>
        </CountBox>
      </Box>
      <BlankBox></BlankBox>
      <Box>
        <ContentBox>
          <ContentText>헬퍼 등록</ContentText>
        </ContentBox>
        <ProfileBtn onPress={() => setRegisterVisible(!registerVisible)}>
          <ProfileText>내 위치 등록하기</ProfileText>
        </ProfileBtn>
        {/**관리자면 신고내역 보는 코드  */}
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
                .then((res) => {
                  //console.log("등록 데이터", res.data);
                  //setHelperLocation(res.data);
                });
            }}
          />
        </Modal>
      </Box>
    </Container>
  );
};
export default Profile;
