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
  pwData,
  contentData,
  winRatData,
  winResData,
  myIdData,
  ratingHelperData,
  responseHelperData,
} from "../atom";
import { MaterialIcons } from "@expo/vector-icons";
import Order from "./Order";
import { apiClient } from "../api";
import { client } from "../client";

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

  const myId = useRecoilValue(myIdData); //웹소켓 연결시 구독을 위한 본인 고유 id 데이터

  const [distanceHelper, setDistanceHelper] = useRecoilState(contentData); //거리순으로 헬퍼데이터  (default)
  const [ratingHelper, setRatingHelper] = useRecoilState(ratingHelperData); //평점순으로 헬퍼데이터
  const [responseHelper, setResponseHelper] =
    useRecoilState(responseHelperData); //응답시간순으로 헬퍼데이터

  const [orderVisible, setOrderVisible] = useState(false);

  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk("error");
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    axios
      .put(
        "http://10.0.2.2:8080/api/location/findHelper/distance",
        { latitude, longitude },
        {
          headers: { Authorization: `${grant}` + " " + `${access}` },
        }
      )
      .then((res) => {
        setDistanceHelper(res.data.content);

        /*axios.put(
          "http://10.0.2.2:8080/api/findHelper/images",
          {
            headers: { Authorization: `${grant}` + " " + `${access}` },
          },
          {}
        );*/
      });

    try {
      const res2 = await apiClient.put(
        "/api/location/findHelper/rating",
        {
          latitude,
          longitude,
        },
        { headers: { Authorization: `${grant}` + " " + `${access}` } }
      );

      const res3 = await apiClient.put(
        "api/location/findHelper/avgReactTime",
        {
          latitude,
          longitude,
        },
        { headers: { Authorization: `${grant}` + " " + `${access}` } }
      );
      console.log("거리순,평점순,응답시간순");

      setRatingHelper(res2.data.content);
      setResponseHelper(res3.data.content);
    } catch (error) {
      console.log(error);
    }
    setLocation({ latitude, longitude }); //내 위치 저장하기 위함
    setLoading(false);
  };
  client.onConnect = function (frame) {
    console.log("연결됨");
    const subscription = client.subscribe(`/queue/${myId}`, function (message) {
      console.log("로그인 웹소켓", message.body);
    });
  };
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
            {distanceHelper.map((location) => (
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

      <HelperView onPress={() => navigate("HelperList")}>
        <Text style={{ fontWeight: "600" }}>주변 헬퍼 보기</Text>
        <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
      </HelperView>
    </View>
  );
};

export default Main;
