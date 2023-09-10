import React, { useState, useEffect } from "react";
import { View, Dimensions, ActivityIndicator, Text, Alert } from "react-native";
import * as Location from "expo-location";
import styled from "styled-components/native";
import axios from "axios";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import {
  accessData,
  contentData,
  myIdData,
  ratingHelperData,
  responseHelperData,
  chatRoomListData,
  helperLocationData,
  locationData,
  currentLocationData,
  chatListData,
  chatCountData,
  nearWorkData,
  hourMoreLocationData,
  onChattingData,
} from "../atom";
import { MaterialIcons } from "@expo/vector-icons";
import Order from "../components/Order";
import { client } from "../client";
import messaging from "@react-native-firebase/messaging";
import { BASE_URL } from "../api";
import Map from "./Map";
import RequestBtn from "./RequestBtn";
import SearchBar from "./SearchBar";
import NearWork from "./NearWork";
import AlarmView from "./AlarmView";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationState, useRoute } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const HelperView = styled.TouchableOpacity`
  flex-direction: row;
  flex: 1;
  background-color: white;
  justify-content: center;
  align-items: center;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
`;
const SelectView = styled.View`
  flex-direction: row;
`;
const SelectBtn = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-color: black;
  background-color: #0fbcf9;
  border-radius: 2px;
  border-color: white;
  border-width: 1px;
`;
const SelectText = styled.Text`
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
`;

const Main = ({ navigation: { navigate }, route }) => {
  const [location, setLocation] = useRecoilState(locationData);
  const [currentLocation, setCurrentLocation] =
    useRecoilState(currentLocationData);
  const [ok, setOk] = useState();
  const [isLoading, setLoading] = useState(true);

  const myId = useRecoilValue(myIdData); //웹소켓 연결시 구독을 위한 본인 고유 id 데이터

  const [distanceHelper, setDistanceHelper] = useRecoilState(contentData); //거리순으로 헬퍼데이터  (default)
  const [ratingHelper, setRatingHelper] = useRecoilState(ratingHelperData); //평점순으로 헬퍼데이터
  const [responseHelper, setResponseHelper] =
    useRecoilState(responseHelperData); //응답시간순으로 헬퍼데이터

  const [orderVisible, setOrderVisible] = useState(false);
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);
  const [chatList, setChatList] = useRecoilState(chatListData);
  const setChatCount = useSetRecoilState(chatCountData);

  const setHelperLocation = useSetRecoilState(helperLocationData);

  const [isMap, isSetMap] = useState(true);
  const [nearWork, setNearWork] = useRecoilState(nearWorkData);

  const setHourMoreLocation = useSetRecoilState(hourMoreLocationData);
  const access = useRecoilValue(accessData);
  const routes = useRoute();
  const nState = useNavigationState((state) => state);
  const onChatting = useRecoilValue(onChattingData);

  const getToken = async () => {
    const token = await messaging().getToken();

    axios
      .put(`${BASE_URL}/api/fcm/${token}`)
      .then((res) => {})
      .catch((error) => console.log(error));
  };

  const getLocation = async () => {
    //api에서 받아오는 location은 내 위치를 계속 추적함
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        // setOk("error");
        throw new Error("Location permission not granted");
      }
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      const res = await axios.put(
        `${BASE_URL}/api/location/findHelper/distance`,
        {
          latitude,
          longitude,
        }
      );
      const data = res.data;
      setDistanceHelper(data);
      const rating = data.concat();
      rating.sort((a, b) => b.rating - a.rating);
      setRatingHelper(rating);
      const response = data.concat();
      response.sort((a, b) => b.avgReactTime - a.avgReactTime);
      setResponseHelper(response);
      setLocation({ latitude, longitude });
      setCurrentLocation({ latitude, longitude });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLocationChange = async (event) => {
    if (event && event.coords) {
      const { latitude, longitude } = event.coords;
      setLocation({ latitude, longitude });
      setCurrentLocation({ latitude, longitude });
      setLoading(false);
    }
  };

  const createHeaders = async () => {
    const token = await AsyncStorage.getItem("authToken");
    //console.log("tkn", token);
    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      return headers;
    } else {
      return null;
    }
  };
  const headers = { Authorization: `Bearer ${access}` };

  client.onConnect = function (frame) {
    console.log("웹소켓 연결완료");
  };

  client.onStompError = async function (frame) {
    console.log("프레임 정보", frame);
    console.log("스톰프 에러: " + frame.headers);
    console.log("스톰프 에러 디테일: " + frame.body);
    if (frame.headers["message"] === "ReIssueJwt") {
      try {
        const res = await axios.put(`${BASE_URL}/reIssueToken`);
        await AsyncStorage.setItem("authToken", res.data.accessToken);
        client.connectHeaders.Authorization = `Bearer ${res.data.accessToken}}`;
        // return client.publish({
        //   destination: `/`,
        // });
      } catch (error) {}
      if (frame.headers["CONNECT"]) {
      } else if (frame.headers["SEND"]) {
      } else if (frame.headers["SUBSCRIBE"]) {
      }
    } else if (frame.headers["message"] === "UNAUTHORIZED") {
      client.deactivate();
      navigate("Login");
    }
  };

  const subscribeToChatTopic = (client, chatId, setChatRoomList) => {
    const subscription = client.subscribe(
      `/topic/chat/${chatId}`,
      async function (message) {
        const parsedMessage = JSON.parse(message.body);
        const chatIds = await AsyncStorage.getItem("chatId");

        if (parsedMessage.messageType === "DeleteConv") {
          const convId = parsedMessage.data;

          axios.get(`${BASE_URL}/api/conversations`).then(({ data }) => {
            data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setChatRoomList(data);
          });
          if (chatIds === convId) {
            navigate("Tabs", { screen: "Chat" });
          }
          subscription.unsubscribe();
        } else {
          isSubscribed = true;
          console.log("새로운 챗방 열기 또는 채팅 보내기");
          const conversationData = JSON.parse(message.body).data;
          setChatRoomList((prev) => {
            const updatedConv = prev.map((conv) =>
              conv._id === conversationData._id ? conversationData : conv
            );
            if (!updatedConv.some((conv) => conv._id === conversationData._id))
              //아이디 비교했을때 일치하는게 없으면 새로운 채팅방추가
              updatedConv.push(conversationData);
            updatedConv.sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            );
            return [...updatedConv];
          });
        }
      },
      headers
    );
  };
  const handleRefresh = () => {
    //새로고침 함수
    getLocation();
  };

  useEffect(() => {
    getToken();
    getLocation();
    const locationEvent = Location.watchPositionAsync(
      {
        accuracy: 5,
        timeInterval: 10000,
      },
      handleLocationChange
    );
    if (route.params !== undefined && route.params.isNearWork) {
      isSetMap(false);
    }
    client.activate();

    if (subscription) {
      subscription.unsubscribe();
    }
    let subscription;
    setTimeout(() => {
      try {
        console.log("로그인 웹소켓");
        subscription = client.subscribe(
          `/queue/${myId}`,
          //처음 채팅이 열렸을때 콜백 시작
          async function (message) {
            const token = await AsyncStorage.getItem("authToken");
            console.log("token", token);
            const parsedMessage = JSON.parse(message.body);

            if (parsedMessage.messageType === "OpenChat") {
              console.log("오픈챗");

              const chatId =
                parsedMessage.data[parsedMessage.data.length - 1]._id; //새로운 채팅방 아이디 찾기
              subscribeToChatTopic(client, chatId, setChatRoomList);
            } else if (parsedMessage.messageType === "SendLocation") {
              console.log("sendLocation");
              try {
                const res = await axios.post(
                  `${BASE_URL}/api/location/sendToCustomer/${parsedMessage.data.id}`,
                  {
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }
                );
              } catch (error) {
                console.log(error);
              }
            } else if (parsedMessage.messageType === "HelperLocation") {
              setHourMoreLocation(parsedMessage.data); //마감시간 1시간 초과 수락한 헬퍼 위치
            } else if (parsedMessage.messageType === "SetConvSeenCount") {
              setChatCount(parsedMessage.data);
            } else if (parsedMessage.messageType === "LogOut") {
              //정지 당할시
              Alert.alert(parsedMessage.data);
              navigate("Login");
            }
          },
          headers
        );
        axios.get(`${BASE_URL}/api/conversations`).then(({ data }) => {
          data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setChatRoomList(data);
          console.log("확인용", data);
          const subscribedChatIds = new Set();
          data.forEach((chat) => {
            if (!subscribedChatIds.has(chat._id)) {
              subscribeToChatTopic(client, chat._id, setChatRoomList);
              subscribedChatIds.add(chat._id);
            }
          });
        });
      } catch (error) {
        console.error("웹소켓 에러", error);
      }
    }, 500);
    return () => {
      if (subscription) {
        subscription.unsubscribe();
        client.deactivate();
      }
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <Loader>
          <ActivityIndicator />
        </Loader>
      ) : (
        <View style={{ flex: 16, position: "relative", width: SCREEN_WIDTH }}>
          <SelectView>
            <SelectBtn
              style={{
                borderBottomWidth: isMap ? 2 : 0,
              }}
              onPress={() => isSetMap(true)}
            >
              <SelectText>주변 보기</SelectText>
            </SelectBtn>
            <SelectBtn
              style={{
                borderBottomWidth: !isMap ? 2 : 0,
              }}
              onPress={() => {
                isSetMap(false);
                axios
                  .get(`${BASE_URL}/api/workList/nearBy`)
                  .then((res) => setNearWork(res.data))
                  .catch((error) => console.log("ee", error));
              }}
            >
              <SelectText>주변 심부름 보기</SelectText>
            </SelectBtn>
          </SelectView>
          {isMap ? (
            <View style={{ flex: 1 }}>
              <Map
                location={location}
                distanceHelper={distanceHelper}
                navigate={navigate}
                currentLocation={currentLocation}
              />
              <SearchBar handleRefresh={handleRefresh} />
              <RequestBtn
                setOrderVisible={setOrderVisible}
                orderVisible={orderVisible}
              />
              <Order
                setOrderVisible={setOrderVisible}
                orderVisible={orderVisible}
                titleName="심부름 등록서"
                btnText="등록하기"
                alertText="심부름이 등록되었습니다."
                divide="0"
              />
              <HelperView onPress={() => navigate("HelperList")}>
                <Text style={{ fontWeight: "600" }}>주변 헬퍼 보기</Text>
                <MaterialIcons
                  name="keyboard-arrow-up"
                  size={24}
                  color="black"
                />
              </HelperView>
              <AlarmView />
            </View>
          ) : (
            <NearWork setNearWork={setNearWork} nearWork={nearWork} />
          )}
        </View>
      )}
    </View>
  );
};

export default Main;
