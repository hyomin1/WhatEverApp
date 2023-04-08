import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  View,
  Dimensions,
  Image,
  ActivityIndicator,
  Text,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import styled from "styled-components/native";
import { PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  accessData,
  grantData,
  contentData,
  myIdData,
  ratingHelperData,
  responseHelperData,
} from "../atom";
import { MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";
import Order from "./Order";
import { apiClient } from "../api";
import { client } from "../client";
import { useMutation } from "react-query";

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
  const onRegionChange = (region) => {
    apiClient
      .put("/api/location/findHelper/distance", {
        latitude: region.latitude,
        longitude: region.longitude,
      })
      .then((res) => console.log("지도 움직일때 마다 요청"));
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
      .put("http://10.0.2.2:8080/api/location/findHelper/distance", {
        latitude,
        longitude,
      })
      .then((res) => {
        setDistanceHelper(res.data.content);
        const rating = res.data.content.concat();
        rating.sort(function (a, b) {
          return b.rating - a.rating;
        });
        setRatingHelper(rating);
        const response = res.data.content.concat();
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
  client.onConnect(headers, (frame) => {
    console.log("연결됨");
    const subscription = client.subscribe(`/queue/${myId}`, function (message) {
      console.log("로그인 웹소켓", message.body);
    });
  });

  client.onStompError = function (frame) {
    console.log("Broker reported error: " + frame.headers["message"]);
    console.log("Additional details: " + frame.body);
  };

  useEffect(() => {
    client.activate();
    getLocation();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <Loader>
          <ActivityIndicator />
        </Loader>
      ) : (
        <View style={{ flex: 16, position: "relative", width: SCREEN_WIDTH }}>
          <MapView
            onRegionChangeComplete={onRegionChange}
            style={{ width: "100%", flex: 1 }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            />
            {distanceHelper
              ? distanceHelper.map((location) => (
                  <Marker
                    onPress={() =>
                      navigate("HelperProfile", {
                        name: location.name,
                        introduce: location.introduce,
                        rating: location.rating,
                        id: location.id,
                        image: location.image,
                      })
                    }
                    key={location.id}
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}
                  >
                    <Image
                      source={{
                        uri: `data:image/png;base64,${location.image}`,
                      }}
                      style={{ height: 35, width: 35, borderRadius: 20 }}
                    />
                  </Marker>
                ))
              : null}
          </MapView>
          <Order
            setOrderVisible={setOrderVisible}
            orderVisible={orderVisible}
          />
          <SearchContaienr style={{ marginLeft: -SCREEN_WIDTH / 3 }}>
            <SearchInput>
              <Text style={{ opacity: 0.6 }}>주소 검색</Text>
              <Entypo name="magnifying-glass" size={22} color="gray" />
            </SearchInput>
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
