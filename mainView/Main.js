import React, { useState, useEffect } from "react";
import { View, Dimensions, ActivityIndicator, Text, Alert } from "react-native";
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
  adminData,
  locationData,
  currentLocationData,
  chatListData,
  chatCountData,
  nearWorkData,
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
import { parse } from "react-native-svg";
import AlarmView from "./AlarmView";

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

  const access = useRecoilValue(accessData);
  const grant = useRecoilValue(grantData);

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

  const isAdmin = useRecoilValue(adminData);

  const [isMap, isSetMap] = useState(true);
  const [nearWork, setNearWork] = useRecoilState(nearWorkData);
  const [convId, setConvId] = useState();

  const getToken = async () => {
    const token = await messaging().getToken();

    axios
      .put(`${BASE_URL}/api/fcm/${token}`)
      .then((res) => {})
      .catch((error) => console.log(error));
  };

  const getLocation = async () => {
    //api에서 받아오는 location은 내 위치를 계속 추적함
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      // setOk("error");
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
        rating.sort((a, b) => b.rating - a.rating);
        setRatingHelper(rating);

        const response = data.concat(); //응답시간 순 정렬
        response.sort((a, b) => a.avgReactTime - b.avgReactTime);

        setResponseHelper(response);
      });

    setLocation({ latitude, longitude }); //내 위치 저장하기 위함
    setCurrentLocation({ latitude, longitude });
    setLoading(false);
  };
  const headers = {
    Authorization: `${grant}` + " " + `${access}`,
  };

  client.onConnect = function (frame) {
    console.log("웹소켓 연결완료");
    //client.activate();
  };
  client.onStompError = function (frame) {
    console.log("Broker reported error: " + frame.headers["message"]);
    console.log("Additional details: " + frame.body);
  };
  const subscribeToChatTopic = (client, chatId, setChatRoomList) => {
    const subscription = client.subscribe(
      `/topic/chat/${chatId}`,
      function (message) {
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
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          return [...updatedConv];
        });
      }
    );
  };

  useEffect(() => {
    getToken();
    getLocation();
    if (route.params !== undefined && route.params.isNearWork) {
      isSetMap(false);
    }
    client.connectHeaders.Authorization = `${grant}` + " " + `${access}`;

    client.activate();

    if (subscription) {
      subscription.unsubscribe();
    }
    let subscription;
    setTimeout(() => {
      console.log("연결됨");
      try {
        console.log("로그인 웹소켓");
        subscription = client.subscribe(
          `/queue/${myId}`,
          //처음 채팅이 열렸을때 콜백 시작
          function (message) {
            const parsedMessage = JSON.parse(message.body);
            console.log(parsedMessage);
            if (parsedMessage.messageType === "OpenChat") {
              console.log("오픈챗");
              const chatId =
                parsedMessage.data[parsedMessage.data.length - 1]._id; //새로운 채팅방 아이디 찾기
              subscribeToChatTopic(client, chatId, setChatRoomList);
            } else if (parsedMessage.messageType === "HelperLocation") {
            } else if (parsedMessage.messageType === "SetConvSeenCount") {
              setChatCount(parsedMessage.data);
              console.log("개수", parsedMessage.data);
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
    }, 1000);
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
              <SearchBar />
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
