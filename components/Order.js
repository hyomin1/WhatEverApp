import styled from "styled-components/native";
import {
  Modal,
  View,
  ScrollView,
  Text,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { indexData, workData, workListData } from "../atom";
import SelectDropdown from "react-native-select-dropdown";
import { useRecoilState, useRecoilValue } from "recoil";
import Postcode from "@actbase/react-daum-postcode";
import * as Location from "expo-location";
import axios from "axios";
import { BASE_URL } from "../api";
import IMP from "iamport-react-native";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
  background-color: #0fbcf9;
  //background-color: lightgray;
`;

const TitleBar = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background-color: white;
`;
const Title = styled.Text`
  flex: 2;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
`;
const Line = styled.View`
  height: 1px;
  background-color: #ccc;
  margin-bottom: 20px;
`;
const Section = styled.View`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 10px 20px;
  margin-bottom: 20px;
`;

const MainText = styled.Text`
  font-weight: bold;
  font-size: 17px;
`;
const Input = styled.TextInput`
  border: 1px solid lightgray;
  padding: 10px;
  border-radius: 20px;
  margin: 10px 0px;
`;
const Button = styled.TouchableOpacity`
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
  padding: 10px 20px;
  margin-bottom: 20px;
  width: 60%;
  align-self: center;
`;
const AddressBox = styled.View`
  margin: 10px 0px;
`;
const TimeBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const AddressInfo = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AddressText = styled.Text`
  flex: 1;
  font-size: 18px;
  margin: 10px 0px;
  color: #006400;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px 0px;
`;

const AddressInputButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const AddressInputButtonText = styled.Text`
  color: blue;
  font-weight: bold;
  font-size: 14px;
  color: #004080;
  margin-left: 5px;
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
      //심부름 등록시
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
          //Alert.alert(alertText);
          setAddress("");
          setAddress2("");
          setWork(res.data);
          setWorkList((prev) => [res.data, ...prev]);
          setOrderVisible(!orderVisible);
          axios
            .post(`${BASE_URL}/api/fcm/sendNearbyHelper`, res.data)
            .then((res) => console.log(res.data))
            .catch((error) => Alert.alert(error.response.data.message));
        })
        .catch((error) => console.log("심부름 신청에러", error));
    } else {
      //심부름 수정시
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
    pg_api_key: "ItEQKi3rY7uvDS8l",

    // [Deprecated v1.0.3]: m_redirect_url
  };
  const [payVisible, setPayVisible] = useState(false);

  const onPayment = (res) => {
    setPayVisible(true);
    console.log(res);
    if (res.imp_success) {
      setPayVisible(false);
      //navigation.replace("Main");
    }
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
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              setOrderVisible(!orderVisible);
              setDeadLineTime(0);
              setAddress("");
              setAddress2("");
            }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Title>{titleName}</Title>
          <View style={{ flex: 1 }}></View>
        </TitleBar>
        <Line />
        <ScrollView style={{ paddingHorizontal: 20 }}>
          <Section>
            <MainText>제목</MainText>
            <Input
              onChangeText={onChangeTitle}
              placeholder="제목을 입력해주세요..."
              style={{ height: 80 }}
            />
          </Section>

          <Section>
            <MainText>내용</MainText>
            <Input
              onChangeText={onChangeContext}
              placeholder="내용을 입력해주세요..."
              multiline
              style={{ height: 140 }}
            />
          </Section>

          <Section>
            <AddressBox>
              <AddressInfo>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MainText>심부름 시킬장소</MainText>
                  <MainText style={{ color: "red" }}>(필수)</MainText>
                </View>
                <AddressInputButton
                  onPress={() => setOrderAddress(!orderAddress)}
                >
                  <FontAwesome name="map-marker" size={24} color="red" />
                  <AddressInputButtonText>주소 입력</AddressInputButtonText>
                </AddressInputButton>
              </AddressInfo>

              <AddressText>{address}</AddressText>

              <Modal animationType="slide" visible={orderAddress}>
                <Postcode
                  style={{ flex: 1, height: 250, marginBottom: 40 }}
                  jsOptions={{ animation: true }}
                  onSelected={async (data) => {
                    //const location = await Location.geocodeAsync(data.address);
                    await axios
                      .get(
                        `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${data.address}`,
                        {
                          headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "X-NCP-APIGW-API-KEY-ID": "sc8bw8njee",
                            "X-NCP-APIGW-API-KEY":
                              "bagOYXE2P7DmQR17nB9M3lNKoAt8e5CqnFTl7Hd8",
                          },
                        }
                      )
                      .then((res) => {
                        setAddress(data.address);
                        setLatitude(res.data.addresses[0].y);
                        setLongitude(res.data.addresses[0].x);
                        setOrderAddress(!orderAddress);
                      })
                      .catch((error) => console.log("naver", error));
                  }}
                />
              </Modal>
            </AddressBox>
          </Section>

          <Section>
            <AddressBox>
              <AddressInfo>
                <MainText>심부름 받을장소</MainText>
                <AddressInputButton
                  onPress={() => setReceiveAddress(!receiveAddress)}
                >
                  <FontAwesome name="map-marker" size={24} color="red" />
                  <AddressInputButtonText>주소 입력</AddressInputButtonText>
                </AddressInputButton>
              </AddressInfo>

              <AddressText>{address2}</AddressText>
              <Modal animationType="slide" visible={receiveAddress}>
                <Postcode
                  style={{ flex: 1, height: 250, marginBottom: 40 }}
                  jsOptions={{ animation: true }}
                  onSelected={async (data) => {
                    await axios
                      .get(
                        `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${data.address}`,
                        {
                          headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "X-NCP-APIGW-API-KEY-ID": "sc8bw8njee",
                            "X-NCP-APIGW-API-KEY":
                              "bagOYXE2P7DmQR17nB9M3lNKoAt8e5CqnFTl7Hd8",
                          },
                        }
                      )
                      .then((res) => {
                        setAddress2(data.address);
                        setReceiveLatitude(res.data.addresses[0].y);
                        setReceiveLongitude(res.data.addresses[0].x);
                        setReceiveAddress(!receiveAddress);
                      })
                      .catch((error) => console.log("naver", error));
                  }}
                />
              </Modal>
            </AddressBox>
          </Section>

          <Section>
            <TimeBox>
              <MainText style={{ marginBottom: 0 }}>마감시간</MainText>

              <SelectDropdown
                buttonStyle={{
                  borderWidth: 1,
                  backgroundColor: "white",
                  borderColor: "lightgray",
                  borderRadius: 10,
                  height: 40,
                  width: 125,
                }}
                data={hours}
                onSelect={(hour, index) => {
                  setDeadLineTime(index + 1);
                }}
                buttonTextAfterSelection={(item) => {
                  return item;
                }}
                renderDropdownIcon={() => (
                  <Text style={{ fontSize: 18 }}>▼</Text>
                )}
                defaultButtonText="시간 보기"
              />
            </TimeBox>
            <AddressText>
              {deadLineTime ? `${deadLineTime}시간` : null}
            </AddressText>
            <Text style={{ color: "gray", fontSize: 11, fontWeight: "bold" }}>
              마감시간 1시간일 경우 헬퍼의 위치를 실시간으로 볼 수 있습니다.
            </Text>
          </Section>

          <Section>
            <MainText>심부름비</MainText>
            <Input
              onChangeText={onChangeReward}
              placeholder="금액을 입력하세요..."
            />
          </Section>

          <Section>
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
          </Section>

          <Button onPress={onPressBtn}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              {btnText}
            </Text>
          </Button>
        </ScrollView>
      </Container>
    </Modal>
  );
};

export default Order;
