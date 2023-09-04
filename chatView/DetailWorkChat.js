import { Modal, TouchableOpacity, Alert, View } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components/native";
import { chatListData, myIdData, workProceedingStatusData } from "../atom";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../api";
import { client } from "../client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundTimer from "react-native-background-timer";
import * as Location from "expo-location";
import { useState } from "react";
import { useEffect } from "react";

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
`;
const TitleBar = styled.View`
  background-color: white;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const Title = styled.Text`
  font-weight: bold;
`;
const ModalContent = styled.View`
  width: 80%;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
`;
const RowView = styled.View`
  flex-direction: row;
`;
const Btn = styled.TouchableOpacity`
  background-color: #3498db;
  width: 40%;
  height: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const BtnText = styled.Text`
  color: white;
  font-weight: 600;
`;
const MainDescription = styled.Text`
  font-size: 15px;
  color: #555;
  font-weight: bold;
  margin-bottom: 3px;
`;
const AddressDescription = styled(MainDescription)`
  color: #333;
  font-size: 13px;
  margin-bottom: 10px;
  text-align: center;
`;
const MoneyText = styled(MainDescription)`
  color: #007bff;
`;
const LocationBtn = styled.TouchableOpacity`
  background-color: lightgray;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 5px;
`;
const LocationText = styled.Text`
  color: #666;
  font-size: 11px;
  padding: 1px 0px;
  font-weight: bold;
`;

const DetailWorkChat = ({
  detailModal,
  setDetailModal,
  messageData,
  myName,
  receiverName,
}) => {
  const [workProceedingStatus, setWorkProceedingStatus] = useRecoilState(
    workProceedingStatusData
  );
  const chatList = useRecoilValue(chatListData);
  const navigation = useNavigation();
  const work = JSON.parse(chatList.chatList[0].message);
  const myId = useRecoilValue(myIdData);

  const [address, setAddress] = useState({
    city: "",
    borough: "",
    quarter: "",
    road: "",
  });
  const sendData = {
    id: work.id,
    title: work.title,
    context: work.context,
    deadLineTime: work.deadLineTime,
    reward: work.reward,
    latitude: work.latitude,
    longitude: work.longitude,
    customerId: work.customerId,
    helperId:
      work.customerId === chatList.participantId
        ? chatList.creatorId
        : chatList.participantId,
  };
  const AcceptCard = {
    message: "Accept work",
    senderName: myName,
    receiverName: receiverName,
  };
  const completeCard = {
    message: "Complete work",
    senderName: myName,
    receiverName: receiverName,
  };

  useEffect(() => {
    const getAddress = async () => {
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse`,
          {
            params: {
              format: "json",
              lat: messageData.latitude,
              lon: messageData.longitude,
              "accept-language": "ko",
            },
          }
        );

        const { city, borough, quarter, road } = res.data.address;
        setAddress({ city, borough, quarter, road });
      } catch (error) {
        Alert.alert(error);
      }
    };
    getAddress();
  }, []);

  const intervalId = (id) => {
    let timerId = null;
    const stopInterval = () => {
      if (timerId !== null) {
        BackgroundTimer.clearInterval(timerId);
        timerId = null;
      }
    };
    BackgroundTimer.setInterval(async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        stopInterval();
        return;
      }
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      try {
        const res = axios.post(
          `${BASE_URL}/api/location/helperLocation/${id}`,
          {
            latitude,
            longitude,
          }
        );
      } catch (error) {
        console.log("this", error);
        Alert.alert("interval", error.response.data.message);
        stopInterval();
      }
    }, 10000);
    if (workProceedingStatus === 2) {
      stopInterval();
    }
  };

  const onAcceptWork = async () => {
    //심부름 수락
    const token = await AsyncStorage.getItem("authToken");
    try {
      const res1 = await axios.put(
        `${BASE_URL}/api/work/matching/${chatList._id}`,
        {
          id: work.id,
          title: work.title,
          context: work.context,
          deadLineTime: work.deadLineTime,
          reward: work.reward,
          latitude: work.latitude,
          longitude: work.longitude,
          customerId: work.customerId,
          helperId:
            work.customerId === chatList.participantId
              ? chatList.creatorId
              : chatList.participantId,
        }
      );
      client.publish({
        destination: `/pub/card/${chatList._id}`,
        body: JSON.stringify(AcceptCard),
        headers: { Authorization: `Bearer ${token}` },
      });
      const res2 = await axios.post(
        `${BASE_URL}/api/fcm/chatNotification/${chatList._id}`
      );
      setWorkProceedingStatus(res1.data.workProceedingStatus);
      if (work.deadLineTime === 1) {
        intervalId(work.id); //1초마다 헬퍼 위치 보내줌 , 실시간 헬퍼 위치 파악
      } else {
        console.log("마감시간 1시간 초과");
      }
      setDetailModal(!detailModal);
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };
  const onPressDeny = () => {
    //심부름 거절
    if (chatList.participatorName === myName) {
      Alert.alert("거절되었습니다.");
    }
  };
  const onWorkComplete = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) return;
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const token = await AsyncStorage.getItem("authToken");
    try {
      const res = await axios.put(
        `${BASE_URL}/api/work/success/${chatList.workId}`,
        {
          latitude,
          longitude,
        }
      );
      client.publish({
        destination: `/pub/card/${chatList._id}`,
        body: JSON.stringify(completeCard),
        headers: { Authorization: `Bearer ${token}` },
      });
      const res2 = axios.post(
        `${BASE_URL}/api/fcm/chatNotification/${chatList._id}`
      );
      setWorkProceedingStatus(res.data.workProceedingStatus);
      setDetailModal(!detailModal);
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={detailModal}
      onRequestClose={() => setDetailModal(!detailModal)}
    >
      <ModalContainer>
        <ModalContent>
          <TitleBar>
            <TouchableOpacity
              onPress={() => setDetailModal(!detailModal)}
              style={{ flex: 1 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Title>상세 정보</Title>
            <View style={{ flex: 1 }}></View>
          </TitleBar>
          {myId === messageData.customerId ||
          messageData.helperId === null ||
          myId === messageData.helperId ? (
            <View>
              <MainDescription>{messageData.context}</MainDescription>
              <MainDescription>
                마감시간 : {messageData.deadLineTime}시간
              </MainDescription>
              <RowView>
                <MainDescription>보상금액 : </MainDescription>
                <MoneyText>{messageData.reward}원</MoneyText>
              </RowView>

              <RowView style={{ justifyContent: "space-between" }}>
                <MainDescription>심부름 하는 장소</MainDescription>
                <LocationBtn
                  onPress={() => {
                    navigation.navigate("WorkMap", {
                      work: messageData,
                    });
                    setDetailModal(!detailModal);
                  }}
                >
                  <LocationText>위치 보기</LocationText>
                </LocationBtn>
              </RowView>
              <AddressDescription>
                {address.city} {address.borough} {address.quarter}{" "}
                {address.road}
              </AddressDescription>
              <RowView style={{ justifyContent: "space-between" }}>
                <MainDescription>심부름 받는 장소</MainDescription>
                <LocationBtn>
                  <LocationText>위치 보기</LocationText>
                </LocationBtn>
              </RowView>
              <AddressDescription></AddressDescription>
            </View>
          ) : (
            <MainDescription>
              다른 헬퍼가 이미 심부름을 진행중입니다.
            </MainDescription>
          )}

          {workProceedingStatus === 0 && myId !== work.customerId ? (
            <RowView style={{ justifyContent: "space-between" }}>
              <Btn onPress={onAcceptWork}>
                <BtnText>수락</BtnText>
              </Btn>
              <Btn onPress={onPressDeny} style={{ backgroundColor: "red" }}>
                <BtnText>거절</BtnText>
              </Btn>
            </RowView>
          ) : null}
          {workProceedingStatus === 1 ? (
            <RowView style={{ justifyContent: "center" }}>
              <Btn onPress={onWorkComplete}>
                <BtnText>심부름 완료하기</BtnText>
              </Btn>
            </RowView>
          ) : null}
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default DetailWorkChat;
