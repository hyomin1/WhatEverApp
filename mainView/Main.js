import React, { useState, useEffect } from "react";
import { View, Dimensions, ActivityIndicator, Text } from "react-native";
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
import { MaterialIcons } from "@expo/vector-icons";
import Order from "../components/Order";
import { client } from "../client";
import messaging from "@react-native-firebase/messaging";
import { BASE_URL } from "../api";
import Map from "./Map";
import RequestBtn from "./RequestBtn";
import SearchBar from "./SearchBar";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
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
    axios //서버에서 헬퍼 정보 받아오기
      .put(`${BASE_URL}/api/location/findHelper/distance`, {
        latitude,
        longitude,
      })
      .then(({ data }) => {
        setDistanceHelper(data); //거리순 데이터

        const rating = data.concat(); //평점 순 정렬
        rating.sort(function (a, b) {
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
    //console.log("연결됨");
    axios
      .get(`${BASE_URL}/api/conversations`)
      .then((res) => {
        setChatRoomList(res.data); // a1일 경우 a1의 채팅리스트를 저장함
        //console.log("채팅목록", res.data);
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
        //console.log("로그인 웹소켓");
        if (JSON.parse(message.body).messageType === "OpenChat") {
          //console.log("오픈챗");

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
          <Map
            location={location}
            distanceHelper={distanceHelper}
            navigate={navigate}
          />
          <SearchBar />
          <RequestBtn
            setOrderVisible={setOrderVisible}
            orderVisible={orderVisible}
          />
          <Order
            setOrderVisible={setOrderVisible}
            orderVisible={orderVisible}
            titleName="심부름 요청서"
            btnText="요청"
            alertText="심부름 요청이 등록되었습니다."
            divide="0"
          />
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
