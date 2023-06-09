import React, { useState, useEffect } from "react";
import { View, Dimensions, ActivityIndicator, Text, Modal } from "react-native";
import * as Location from "expo-location";
import styled from "styled-components/native";
import axios from "axios";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import {
  accessData,
  grantData,
  contentData,
  myIdData,
  ratingHelperData,
  responseHelperData,
  chatRoomListData,
  helperLocationData,
} from "../atom";
import { MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";
import Order from "./Order";
import { client } from "../client";
import Postcode from "@actbase/react-daum-postcode";
import messaging from "@react-native-firebase/messaging";
import { BASE_URL } from "../api";
import Map from "./Map";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const SearchContaienr = styled.View`
  position: absolute;
  width: 70%;
  left: 50%;
  top: 2%;
`;
const SearchInput = styled.Pressable`
  height: 40px;
  background-color: white;
  opacity: 0.8;
  border-radius: 20px;
  padding: 0px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const BtnContainer = styled.View`
  position: absolute;
  width: 50%;
  bottom: 4%;
  left: 50%;
`;
const Button = styled.Pressable`
  padding: 0 15px;
  height: 45px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: black;
`;
const HelperView = styled.Pressable`
  flex-direction: row;
  flex: 1;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const Main = ({ navigation: { navigate } }) => {
  const [location, setLocation] = useState();
  const [ok, setOk] = useState();
  const [isLoading, setLoading] = useState(true);

  const access = useRecoilValue(accessData);
  const grant = useRecoilValue(grantData);

  const myId = useRecoilValue(myIdData); //웹소켓 연결시 구독을 위한 본인 고유 id 데이터

  const [distanceHelper, setDistanceHelper] = useRecoilState(contentData); //거리순으로 헬퍼데이터  (default)
  const [ratingHelper, setRatingHelper] = useRecoilState(ratingHelperData); //평점순으로 헬퍼데이터
  const [responseHelper, setResponseHelper] =
    useRecoilState(responseHelperData); //응답시간순으로 헬퍼데이터

  const [orderVisible, setOrderVisible] = useState(false);
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);

  const [searchAddress, setSearchAddress] = useState(false);

  const setHelperLocation = useSetRecoilState(helperLocationData);
  const getToken = async () => {
    const token = await messaging().getToken();
    //console.log(token);
    axios
      .put(`${BASE_URL}/api/fcm/${token}`)
      .then((res) => {
        //console.log("fcm", res.data);
      })
      .catch((error) => console.log(error));
  };

  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk("error");
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    axios
      .put(`${BASE_URL}/api/location/findHelper/distance`, {
        latitude,
        longitude,
      })
      .then(({ data }) => {
        console.log(data);
        setDistanceHelper(data);
        const rating = data.concat();
        rating.sort(function (a, b) {
          //평점 순 정렬
          return b.rating - a.rating;
        });
        setRatingHelper(rating);
        const response = data.concat(); //응답시간 순 정렬
        response.sort(function (a, b) {
          return a.avgReactTime - b.avgReactTime;
        });
        setResponseHelper(response);
      });

    setLocation({ latitude, longitude }); //내 위치 저장하기 위함
    setLoading(false);
  };
  const headers = {
    Authorization: `${grant}` + " " + `${access}`,
  };

  client.onConnect = function (frame) {
    console.log("연결됨");
    axios
      .get(`${BASE_URL}/api/conversations`)
      .then((res) => {
        setChatRoomList(res.data); // a1일 경우 a1의 채팅리스트를 저장함
        console.log("채팅목록", res.data);
        res.data.map((id) =>
          client.subscribe(`/topic/chat/${id._id}`, function (message) {
            //console.log("채팅 목록에서 들어간 메시지", message.body);
            axios.get(`${BASE_URL}/api/conversations`).then((res) => {
              setChatRoomList(res.data);
            });
          })
        );
      })
      .catch(() => console.log("에러"));

    const subscription = client.subscribe(
      `/queue/${myId}`,
      function (message) {
        console.log("로그인 웹소켓");
        if (JSON.parse(message.body).messageType === "OpenChat") {
          console.log("오픈챗");

          const chatId = JSON.parse(message.body).data[
            JSON.parse(message.body).data.length - 1
          ]._id;
          const sub = client.subscribe(
            `/topic/chat/${chatId}`,
            function (message) {
              //console.log("요청해서 들어간 채팅방 메시지", message.body);
              axios.get(`${BASE_URL}/api/conversations`).then((res) => {
                setChatRoomList(res.data);
              });
            }
          );
        }
      },
      headers
    );
  };
  client.onStompError = function (frame) {
    console.log("Broker reported error: " + frame.headers["message"]);
    console.log("Additional details: " + frame.body);
  };

  useEffect(() => {
    getToken();
    getLocation();
    client.connectHeaders.Authorization = `${grant}` + " " + `${access}`;
    client.activate();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <Loader>
          <ActivityIndicator />
        </Loader>
      ) : (
        <View style={{ flex: 16, position: "relative", width: SCREEN_WIDTH }}>
          <Map location={location} distanceHelper={distanceHelper} />
          <Order
            setOrderVisible={setOrderVisible}
            orderVisible={orderVisible}
            titleName="심부름 요청서"
            btnText="요청"
            alertText="심부름 요청이 등록되었습니다."
            divide="0"
          />

          <SearchContaienr style={{ marginLeft: -SCREEN_WIDTH / 3 }}>
            {/* 주소 검색이후 이동 + 서버 요청 코드 추가 */}
            <SearchInput onPress={() => setSearchAddress(!searchAddress)}>
              <Text style={{ opacity: 0.6 }}>주소 검색</Text>
              <Entypo name="magnifying-glass" size={22} color="gray" />
            </SearchInput>
            <Modal animationType="slide" visible={searchAddress}>
              <Postcode
                style={{ flex: 1, height: 250, marginBottom: 40 }}
                jsOptions={{ animation: true }}
                onSelected={async (data) => {
                  const location = await Location.geocodeAsync(data.query);
                  //setSearchLatitude(location[0].latitude);
                  //setSearchLongitude(location[0].longitude);
                  setSearchAddress(!searchAddress);
                }}
              />
            </Modal>
          </SearchContaienr>
          <BtnContainer style={{ marginLeft: -SCREEN_WIDTH / 4 }}>
            <Button onPress={() => setOrderVisible(!orderVisible)}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign
                  name="shoppingcart"
                  size={24}
                  color="#0fbcf9"
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={{ color: "#0fbcf9", fontWeight: "800", fontSize: 15 }}
                >
                  심부름 요청하기
                </Text>
              </View>
            </Button>
          </BtnContainer>
        </View>
      )}

      <HelperView onPress={() => navigate("HelperList")}>
        <Text style={{ fontWeight: "600" }}>주변 헬퍼 보기</Text>
        <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
      </HelperView>
    </View>
  );
};

export default Main;
