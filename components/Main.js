import React, { useState, useEffect, createContext } from "react";
import MapView, { Marker } from "react-native-maps";

import { View, Dimensions, Image, ActivityIndicator, Text } from "react-native";
import * as Location from "expo-location";
import styled from "styled-components/native";
import { PROVIDER_GOOGLE } from "react-native-maps";

import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  accessData,
  grantData,
  pwData,
  contentData,
  winRatData,
  winResData,
} from "../atom";
import { MaterialIcons } from "@expo/vector-icons";
import HelperList from "./HelperList";
import Order from "./Order";
import { api } from "../api";
axios.defaults.headers.common[("Authorization", grantData + " " + accessData)];
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
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
  const [content, setContent] = useRecoilState(contentData); //거리순 default
  const [rating, setRating] = useRecoilState(winRatData); //평점순
  const [response, setResponse] = useRecoilState(winResData); //응답시간순

  const pw = useRecoilValue(pwData);

  const [helperVisible, setHelperVisible] = useState(false);
  const [orderVisible, setOrderVisible] = useState(false);

  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk("error");
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    try {
      const res1 = await api.put(
        "/api/location/findHelper/distance",
        { latitude, longitude },
        { headers: { Authorization: `${grant}` + " " + `${access}` } }
      );
      const res2 = await api.put(
        "/api/location/findHelper/rating",
        {
          latitude,
          longitude,
        },
        { headers: { Authorization: `${grant}` + " " + `${access}` } }
      );
      const res3 = await api.put(
        "api/location/findHelper/avgReactTime",
        {
          latitude,
          longitude,
        },
        { headers: { Authorization: `${grant}` + " " + `${access}` } }
      );
      console.log("거리순,평점순,응답시간순");
      setContent(res1.data.content);
      setRating(res2.data.content);
      setResponse(res3.data.content);
    } catch (error) {
      console.log(error);
    }
    setLocation({ latitude, longitude }); //내 위치 저장하기 위함
    setLoading(false);
  };
  useEffect(() => {
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
            style={{ width: "100%", flex: 1 }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
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
            {content.map((location) => (
              <Marker
                key={location.id}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
              >
                <Image
                  source={require("../images/help.png")}
                  style={{ height: 35, width: 35, borderRadius: 20 }}
                />
              </Marker>
            ))}
          </MapView>
          <Order
            setOrderVisible={setOrderVisible}
            orderVisible={orderVisible}
          />
          <BtnContainer style={{ marginLeft: -SCREEN_WIDTH / 4 }}>
            <Button onPress={() => setOrderVisible(!orderVisible)}>
              <Text style={{ color: "white", fontWeight: "600", fontSize: 17 }}>
                심부름 요청하기
              </Text>
            </Button>
          </BtnContainer>
        </View>
      )}
      <HelperList
        setHelperVisible={setHelperVisible}
        helperVisible={helperVisible}
      />
      <HelperView onPress={() => setHelperVisible(!helperVisible)}>
        <Text style={{ fontWeight: "600" }}>주변 헬퍼 보기</Text>
        <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
      </HelperView>
    </View>
  );
};

export default Main;
