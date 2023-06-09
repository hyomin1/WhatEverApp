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

const Container = styled.View`
  flex: 1;
`;

const TitleBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  background-color: white;
`;
const Title = styled.Text`
  font-weight: 600;
  font-size: 16px;
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
  font-size: 18px;
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
  flex-direction: row;
  justify-content: space-between;
`;
const AddressInputText = styled.Text`
  color: blue;
`;
const Address = styled.View`
  margin-bottom: 20px;
`;
const AddressText = styled.Text`
  font-size: 16px;
`;

const Order = ({
  orderVisible,
  setOrderVisible,
  titleName,
  btnText,
  alertText,
  divide,
}) => {
  const hours = [1, 2, 3, 4];

  const [title, setTitle] = useState();
  const [context, setContext] = useState();
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
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
        .post("http://10.0.2.2:8080/api/work", {
          latitude,
          longitude,
          reward,
          deadLineTime,
          title,
          context,
        })
        .then((res) => {
          console.log("심부름 요청 성공", res.data);
          Alert.alert(alertText);
          setAddress("");
          setAddress2("");
          setWork(res.data);
          setOrderVisible(!orderVisible);
        })
        .catch((error) => console.log(error));
    } else {
      //심부름 수정 (수정한 데이터 어떻게 유지?)

      console.log("수저완료");
      setOrderVisible(!orderVisible);
      const copiedWorkList = [...workList];
      console.log("wl", workList);
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
        .put("http://10.0.2.2:8080/api/work", {
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
                  }}
                  name="cancel"
                  size={24}
                  color="black"
                />
              </View>

              <Title>{titleName}</Title>

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
                <ErrandPlace
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <MainText>심부름 시킬장소</MainText>
                  <Pressable onPress={() => setOrderAddress(!orderAddress)}>
                    <AddressInputText>주소 입력</AddressInputText>
                  </Pressable>
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
                <Address>
                  <AddressText>{address}</AddressText>
                </Address>
                <ErrandPlace
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <MainText>심부름 받을장소</MainText>
                  <Pressable onPress={() => setReceiveAddress(!receiveAddress)}>
                    <AddressInputText>주소 입력</AddressInputText>
                  </Pressable>
                  <Modal animationType="slide" visible={receiveAddress}>
                    <Postcode
                      style={{ flex: 1, height: 250, marginBottom: 40 }}
                      jsOptions={{ animation: true }}
                      onSelected={async (data) => {
                        const location = await Location.geocodeAsync(
                          data.query
                        );

                        setAddress2(data.address);
                        setReceiveAddress(!receiveAddress);
                      }}
                    />
                  </Modal>
                </ErrandPlace>
                <Address>
                  <AddressText>{address2}</AddressText>
                </Address>

                <MainText>예상 소요 시간</MainText>
                <SelectDropdown
                  buttonStyle={{
                    backgroundColor: "#2196f3",
                  }}
                  buttonTextStyle={{
                    color: "white",
                    fontWeight: "600",
                  }}
                  data={hours}
                  onSelect={(hour) => setDeadLineTime(hour)}
                  defaultButtonText="시간"
                />
                <MainText style={{ marginTop: 20 }}>심부름 비</MainText>
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
