import { View, Text, TextInput, Pressable, Modal } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import Fix from "./Fix";
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
  margin: 10px 0;
`;
const ContentBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 30px 20px;
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
  const [registerVisible, setRegisterVisible] = useState(false);

  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const myImg = useRecoilValue(myImgData);
  const rating = useRecoilValue(ratingData);
  const setHelperLocation = useSetRecoilState(helperLocationData);

  const goFix = () => {
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
        <Fix setModalVisible={setModalVisible} modalVisible={modalVisible} />
        <ProfileBtn onPress={goFix}>
          <ProfileText>회원정보 수정</ProfileText>
        </ProfileBtn>
        <Line />
      </View>
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
      <Box>
        <Pressable onPress={() => setRegisterVisible(!registerVisible)}>
          <Text>내 위치 등록하기</Text>
        </Pressable>
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
