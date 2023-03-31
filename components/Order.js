import styled from "styled-components/native";
import { Modal, View, ScrollView, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Postcode from "@actbase/react-daum-postcode";
import { useState } from "react";
import { accessData, grantData, imgData } from "../atom";
import * as Location from "expo-location";
import SelectDropdown from "react-native-select-dropdown";
import axios from "axios";
import { useRecoilValue } from "recoil";

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

const Order = ({ orderVisible, setOrderVisible }) => {
  const hours = [1, 2, 3, 4];

  const access = useRecoilValue(accessData);
  const grant = useRecoilValue(grantData);
  const auth = grant + " " + access;

  const [title, setTitle] = useState();
  const [context, setContext] = useState();
  const [isModal, setModal] = useState(false);
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [time, setTime] = useState();
  const [reward, setReward] = useState();

  const onChangeTitle = (payload) => {
    setTitle(payload);
  };
  const onChangeContext = (payload) => {
    setContext(payload);
  };
  const onChangeReward = (payload) => {
    setReward(payload);
  };
  const onPressBtn = () => {
    axios
      .post(
        "http://10.0.2.2:8080/api/work",
        {
          latitude: latitude,
          longitude: longitude,
          reward: reward,
          deadLineTime: time,
          title: title,
          context: context,
        },
        { headers: { Authorization: `${grant}` + " " + `${access}` } }
      )
      .then((res) => console.log(res.data));
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

              <Title>심부름 요청서</Title>

              <View style={{ flex: 1 }}></View>
            </TitleBar>
            <Line />
            <MainBar>
              <View>
                <MainText>제목</MainText>
                <TitleInput
                  onChangeText={onChangeContext}
                  placeholder="제목을 입력해주세요..."
                />
                <MainText>내용</MainText>
                <TitleInput
                  onChangeText={onChangeTitle}
                  placeholder="내용을 입력해주세요..."
                />
                <MainText>심부름 장소</MainText>
                <Postcode
                  style={{ flex: 1, height: 250, marginBottom: 40 }}
                  jsOptions={{ animation: true }}
                  onSelected={async (data) => {
                    const location = await Location.geocodeAsync(data.query);
                    setLatitude(location[0].latitude);
                    setLongitude(location[0].longitude);
                  }}
                />
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
                  onSelect={(hour) => setTime(hour)}
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
                  요청
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
