import styled from "styled-components/native";
import { Modal, View, ScrollView, Text, Pressable, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { indexData, workData, workListData } from "../atom";
import SelectDropdown from "react-native-select-dropdown";
import { useRecoilState, useRecoilValue } from "recoil";
import Postcode from "@actbase/react-daum-postcode";
import * as Location from "expo-location";
import axios from "axios";
import { BASE_URL } from "../api";

const Container = styled.View`
  flex: 1;
`;

const TitleBar = styled.View`
  flex-direction: row;
  margin-top: 10px;
  background-color: white;
`;
const Title = styled.Text`
  font-weight: 600;
  font-size: 17px;
  margin-bottom: 10px;
`;
const Line = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 0.5px;
  margin-top: 3px;
`;
const MainBar = styled.View`
  padding: 0px 20px;
  margin-top: 20px;
`;
const MainText = styled.Text`
  font-weight: 600;
  font-size: 17px;
  margin-bottom: 10px;
`;
const TitleInput = styled.TextInput`
  height: 50px;
  border-width: 0.9px;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 40px;
`;
const Button = styled.Pressable`
  padding: 0 15px;
  height: 40px;
  border-radius: 10px;
  margin: 5px 0;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
`;
const ErrandPlace = styled.View`
  border: 2px solid lightgray;
  border-radius: 5px;
  margin-bottom: 50px;
`;
const ErrandBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background-color: lightgray;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  align-items: center;
  height: 40px;
  padding: 0px 5px;
`;
const AddressInputText = styled.Text`
  color: blue;
  font-size: 12px;
`;
const Address = styled.View`
  align-items: center;
  justify-content: center;
  height: 40px;
`;
const AddressText = styled.Text`
  font-size: 17px;
  font-weight: 600;
`;
const DropdownContainer = styled.View`
  width: 200px;
`;

const Order = ({
  orderVisible,
  setOrderVisible,
  titleName,
  btnText,
  alertText,
  divide,
}) => {
  const hours = ["1시간", "2시간", "3시간", "4시간"];

  const [title, setTitle] = useState();
  const [context, setContext] = useState();
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [receiveLatitude, setReceiveLatitude] = useState();
  const [receiveLongitude, setReceiveLongitude] = useState();
  const [deadLineTime, setDeadLineTime] = useState();
  const [reward, setReward] = useState();

  const [work, setWork] = useRecoilState(workData);

  const [address, setAddress] = useState();
  const [address2, setAddress2] = useState();

  const [orderAddress, setOrderAddress] = useState(false);
  const [receiveAddress, setReceiveAddress] = useState(false);

  const [workList, setWorkList] = useRecoilState(workListData);

  const indexValue = useRecoilValue(indexData);

  const onChangeTitle = (payload) => {
    setTitle(payload);
  };
  const onChangeContext = (payload) => {
    setContext(payload);
  };
  const onChangeReward = (payload) => {
    setReward(payload);
  };

  const onPressBtn = async () => {
    if (divide === "0") {
      await axios
        .post(`${BASE_URL}/api/work`, {
          latitude,
          longitude,
          reward,
          deadLineTime,
          title,
          context,
          receiveLatitude,
          receiveLongitude,
        })
        .then((res) => {
          Alert.alert(alertText);
          setAddress("");
          setAddress2("");
          setWork(res.data);
          setOrderVisible(!orderVisible);
        })
        .catch((error) => console.log(error));
    } else {
      setOrderVisible(!orderVisible);
      const copiedWorkList = [...workList];
      //console.log("wl", workList);
      copiedWorkList[indexValue].title = title
        ? title
        : copiedWorkList[indexValue].title;
      copiedWorkList[indexValue].context = context
        ? context
        : copiedWorkList[indexValue].context;
      copiedWorkList[indexValue].latitude = latitude
        ? latitude
        : copiedWorkList[indexValue].latitude;
      copiedWorkList[indexValue].longitude = longitude
        ? longitude
        : copiedWorkList[indexValue].longitude;
      copiedWorkList[indexValue].deadLineTime = deadLineTime
        ? deadLineTime
        : copiedWorkList[indexValue].deadLineTime;
      copiedWorkList[indexValue].reward = reward
        ? reward
        : copiedWorkList[indexValue].reward;
      setWorkList(copiedWorkList);
      axios
        .put(`${BASE_URL}/api/work`, {
          id: copiedWorkList[indexValue].id,
          title: copiedWorkList[indexValue].title,
          context: copiedWorkList[indexValue].context,
          latitude: copiedWorkList[indexValue].latitude,
          longitude: copiedWorkList[indexValue].longitude,
          deadLineTime: copiedWorkList[indexValue].deadLineTime,
          reward: copiedWorkList[indexValue].reward,
        })
        .then((res) => {
          console.log("수정전송");
        });
    }
    setDeadLineTime("");
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={orderVisible}
      onRequestClose={() => setOrderVisible(!orderVisible)}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, opacity: 0.8, backgroundColor: "gray" }}></View>
        <ScrollView style={{ backgroundColor: "white" }}>
          <Container>
            <TitleBar>
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 10,
                }}
              >
                <MaterialIcons
                  onPress={() => {
                    setOrderVisible(!orderVisible);
                    setDeadLineTime(0);
                  }}
                  name="cancel"
                  size={24}
                  color="black"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Title>{titleName}</Title>
              </View>

              <View style={{ flex: 1 }}></View>
            </TitleBar>
            <Line />
            <MainBar>
              <View>
                <MainText>제목</MainText>
                <TitleInput
                  onChangeText={onChangeTitle}
                  placeholder="제목을 입력해주세요..."
                />
                <MainText>내용</MainText>
                <TitleInput
                  onChangeText={onChangeContext}
                  placeholder="내용을 입력해주세요..."
                />
                <ErrandPlace>
                  <ErrandBox>
                    <MainText style={{ marginBottom: 0 }}>
                      심부름 시킬장소
                    </MainText>
                    <Pressable onPress={() => setOrderAddress(!orderAddress)}>
                      <AddressInputText>주소 입력</AddressInputText>
                    </Pressable>
                  </ErrandBox>

                  <Address>
                    <AddressText>{address}</AddressText>
                  </Address>

                  <Modal animationType="slide" visible={orderAddress}>
                    <Postcode
                      style={{ flex: 1, height: 250, marginBottom: 40 }}
                      jsOptions={{ animation: true }}
                      onSelected={async (data) => {
                        const location = await Location.geocodeAsync(
                          data.query
                        );
                        setAddress(data.address);
                        setLatitude(location[0].latitude);
                        setLongitude(location[0].longitude);
                        setOrderAddress(!orderAddress);
                      }}
                    />
                  </Modal>
                </ErrandPlace>

                <ErrandPlace>
                  <ErrandBox>
                    <MainText style={{ marginBottom: 0 }}>
                      심부름 받을장소
                    </MainText>
                    <Pressable
                      onPress={() => setReceiveAddress(!receiveAddress)}
                    >
                      <AddressInputText>주소 입력</AddressInputText>
                    </Pressable>
                  </ErrandBox>
                  <Address>
                    <AddressText>{address2}</AddressText>
                  </Address>

                  <Modal animationType="slide" visible={receiveAddress}>
                    <Postcode
                      style={{ flex: 1, height: 250, marginBottom: 40 }}
                      jsOptions={{ animation: true }}
                      onSelected={async (data) => {
                        const location = await Location.geocodeAsync(
                          data.query
                        );
                        setAddress2(data.address);
                        setReceiveLatitude(location[0].latitude);
                        setReceiveLongitude(location[0].longitude);
                        setReceiveAddress(!receiveAddress);
                      }}
                    />
                  </Modal>
                </ErrandPlace>
                <ErrandPlace>
                  <ErrandBox>
                    <MainText style={{ marginBottom: 0 }}>마감시간</MainText>
                    <DropdownContainer>
                      <SelectDropdown
                        buttonStyle={{
                          width: 200,
                          height: 40,
                          borderWidth: 0, // "border" 대신 "borderWidth" 사용
                          backgroundColor: "lightgray",
                        }}
                        data={hours}
                        onSelect={(hour) => {
                          const numberHour = parseInt(hour.charAt(0));

                          setDeadLineTime(numberHour);
                        }}
                        renderDropdownIcon={() => (
                          <Text style={{ fontSize: 14, paddingHorizontal: 5 }}>
                            ▼
                          </Text>
                        )}
                        defaultButtonText="시간 선택"
                        rowStyle={{
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                        }}
                        rowTextStyle={{
                          fontSize: 14,
                          color: "black",
                        }}
                      />
                    </DropdownContainer>
                  </ErrandBox>
                </ErrandPlace>

                <MainText style={{ marginTop: 20 }}>심부름비</MainText>
                <TitleInput
                  onChangeText={onChangeReward}
                  placeholder="금액을 입력하세요..."
                />
              </View>
              <Button onPress={onPressBtn}>
                <Text
                  style={{ color: "white", fontWeight: "600", fontSize: 15 }}
                >
                  {btnText}
                </Text>
              </Button>
            </MainBar>
          </Container>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default Order;
