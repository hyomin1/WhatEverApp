import styled from "styled-components/native";
import { Modal, View, ScrollView, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { indexData, workData, workListData } from "../atom";
import SelectDropdown from "react-native-select-dropdown";
import { useRecoilState, useRecoilValue } from "recoil";
import Postcode from "@actbase/react-daum-postcode";
import * as Location from "expo-location";
import axios from "axios";
import { BASE_URL } from "../api";
import IMP from "iamport-react-native";

const Container = styled.View`
  flex: 1;
  background-color: white;
  padding: 20px;
`;

const TitleBar = styled.View`
  flex-direction: row;
  align-items: center;

  margin-bottom: 20px;
`;
const Title = styled.Text`
  flex: 2;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
`;
const Line = styled.View`
  height: 1px;
  background-color: #ccc;
  margin: 10px 0;
`;

const MainText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  margin-top: 15px;
`;
const Input = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  margin-top: 5px;
`;
const Button = styled.TouchableOpacity`
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
  padding: 10px 20px;
`;
const AddressBox = styled.View`
  margin-top: 20px;
`;
const AddressText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-top: 10px;
`;

const AddressInputButton = styled.TouchableOpacity`
  background-color: #2196f3;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
  margin-top: 10px;
`;

const AddressInputButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

const DropdownContainer = styled.View`
  width: 200px;
  height: 40px;
  border: 1px solid lightgray;
  border-radius: 5px;
  margin-top: 10px;
  background-color: #f5f5f5;
  justify-content: center;
`;

const Order = ({
  orderVisible,
  setOrderVisible,
  titleName,
  btnText,
  alertText,
  divide,
  navigation,
}) => {
  const hours = [1, 2, 3, 4];

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
    console.log(deadLineTime);
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
  const data = {
    pg: "html5_inicis",
    pay_method: "card",
    name: "결제 테스트",
    merchant_uid: `mid_${new Date().getTime()}`,
    amount: "1",
    buyer_name: "홍길동",
    buyer_tel: "01012345678",
    buyer_email: "example@naver.com",
    buyer_addr: "서울시 강남구 신사동 661-16",
    buyer_postcode: "06018",
    app_scheme: "example",
    // [Deprecated v1.0.3]: m_redirect_url
  };
  const [payVisible, setPayVisible] = useState(false);
  const onPayment = (res) => {
    setPayVisible(true);
    console.log(res);
    // IMP.request_pay(data, () => {
    //   console.log("g?");
    // });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={orderVisible}
      onRequestClose={() => setOrderVisible(!orderVisible)}
    >
      <Container>
        <TitleBar>
          <Ionicons
            style={{ flex: 1 }}
            onPress={() => {
              setOrderVisible(!orderVisible);
              setDeadLineTime(0);
            }}
            name="arrow-back"
            size={24}
            color="black"
          />
          <Title>{titleName}</Title>
          <View style={{ flex: 1 }}></View>
        </TitleBar>
        <Line />
        <ScrollView>
          <MainText>제목</MainText>
          <Input
            onChangeText={onChangeTitle}
            placeholder="제목을 입력해주세요..."
          />
          <MainText>내용</MainText>
          <Input
            onChangeText={onChangeContext}
            placeholder="내용을 입력해주세요..."
            multiline
          />
          <AddressBox>
            <MainText>심부름 시킬장소</MainText>
            <AddressInputButton onPress={() => setOrderAddress(!orderAddress)}>
              <AddressInputButtonText>주소 입력</AddressInputButtonText>
            </AddressInputButton>
            <AddressText>{address}</AddressText>
            <Modal animationType="slide" visible={orderAddress}>
              <Postcode
                style={{ flex: 1, height: 250, marginBottom: 40 }}
                jsOptions={{ animation: true }}
                onSelected={async (data) => {
                  const location = await Location.geocodeAsync(data.query);
                  setAddress(data.address);
                  setLatitude(location[0].latitude);
                  setLongitude(location[0].longitude);
                  setOrderAddress(!orderAddress);
                }}
              />
            </Modal>
          </AddressBox>

          <AddressBox>
            <MainText>심부름 받을장소</MainText>
            <AddressInputButton
              onPress={() => setReceiveAddress(!receiveAddress)}
            >
              <AddressInputButtonText>주소 입력</AddressInputButtonText>
            </AddressInputButton>
            <AddressText>{address2}</AddressText>
            <Modal animationType="slide" visible={receiveAddress}>
              <Postcode
                style={{ flex: 1, height: 250, marginBottom: 40 }}
                jsOptions={{ animation: true }}
                onSelected={async (data) => {
                  const location = await Location.geocodeAsync(data.query);
                  setAddress2(data.address);
                  setReceiveLatitude(location[0].latitude);
                  setReceiveLongitude(location[0].longitude);
                  setReceiveAddress(!receiveAddress);
                }}
              />
            </Modal>
          </AddressBox>

          <AddressBox>
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
                  //const numberHour = parseInt(hour.charAt(0));
                  //console.log(typeof numberHour);
                  setDeadLineTime(hour);
                }}
                renderDropdownIcon={() => (
                  <Text style={{ fontSize: 14, paddingHorizontal: 5 }}>▼</Text>
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
          </AddressBox>

          <MainText>심부름비</MainText>
          <Input
            onChangeText={onChangeReward}
            placeholder="금액을 입력하세요..."
          />
          <MainText>결제</MainText>
          <Pressable onPress={onPayment}>
            <Text>결제하기</Text>
          </Pressable>
          <Modal visible={payVisible}>
            <IMP.Payment
              style={{ flex: 1, height: 250, marginBottom: 40 }}
              userCode={"imp26520641"}
              data={data}
              callback={onPayment}
            />
            <Pressable onPress={() => setPayVisible(false)}>
              <Text>닫기</Text>
            </Pressable>
          </Modal>
        </ScrollView>

        <Button onPress={onPressBtn}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            {btnText}
          </Text>
        </Button>
      </Container>
    </Modal>
  );
};

export default Order;
