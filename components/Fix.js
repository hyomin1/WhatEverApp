import {
  Text,
  View,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  accessData,
  grantData,
  imgData,
  nameData,
  IntroduceData,
  responseData,
  distanceData,
  ratingData,
  uniqueIdData,
  pwData,
} from "../atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
const Center = styled.View`
  flex: 1;
`;
const Container = styled.View`
  flex: 1;
  background-color: white;
  width: 100%;
  padding: 0px 10px;
`;
const TitleBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  background-color: white;
`;
const Title = styled.Text`
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 10px;
`;

const MainBar = styled.View`
  flex: 1;
`;
const ImgView = styled.View`
  flex: 0.8;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;
const ProfileImg = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;
const AddPhoto = styled.Pressable`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background-color: black;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 23px;
  bottom: 1px;
`;
const Line = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 0.5px;
  margin: 10px 0;
`;
const FixView = styled.View`
  flex: 2;
  margin-top: 20px;
`;
const InputView = styled.View`
  margin-bottom: 20px;
`;
const Inform = styled.Text`
  font-size: 18px;
  font-weight: 800;
  margin: 0 20px;
`;
const Input = styled.TextInput`
  height: 40px;
  border-width: 1px;
  padding: 10px;
  margin: 10px 20px;
  border-radius: 10px;
`;
const IntroduceInput = styled.TextInput`
  height: 160px;
  border-width: 1px;
  border-radius: 10px;
  padding: 10px;
  margin: 10px 20px;
`;
const Button = styled.Pressable`
  padding: 0 15px;
  height: 40px;
  border-radius: 10px;
  margin: 5px 0;
  align-items: center;
  justify-content: center;
  background-color: black;
`;
const CheckBtn = styled.Pressable`
  padding: 0 15px;
  height: 40px;
  width: 60px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: black;
`;

const Fix = ({ modalVisible, setModalVisible }) => {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions(); //권한 요청을 위한 hooks
  const [img, setImg] = useRecoilState(imgData);

  const access = useRecoilValue(accessData);
  const grant = useRecoilValue(grantData);
  const auth = grant + " " + access;

  const [name, setName] = useRecoilState(nameData);
  const [introduce, setIntroduce] = useRecoilState(IntroduceData);
  const [pw, setPw] = useRecoilState(pwData);
  const response = useRecoilValue(responseData);
  const distance = useRecoilValue(distanceData);
  const rating = useRecoilValue(ratingData);
  const uniqueId = useRecoilValue(uniqueIdData);

  const [changePw, setChangePw] = useState();
  const [changePw2, setChangePw2] = useState();

  const [ok, setOk] = useState(false);

  const pickImage = async () => {
    if (!status.granted) {
      const permission = await requestPermission();
      if (!permission.granted) return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      //이미지 업로드 기능
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      aspect: [1, 1],
    });
    if (result.canceled) {
      //이미지 업로드 취소한 경우
      return;
    }
    setImg(result.uri);
    const localUri = result.uri;
    const fileName = localUri.split("/").pop();
    const match = /\.(\w+)$/.exec(fileName ?? "");
    const type = match ? `image/${match[1]}` : `image`;
    const formData = new FormData();

    formData.append("image", {
      uri: localUri,
      name: fileName,
      type,
    });

    await axios({
      method: "put",
      url: "http://10.0.2.2:8080/api/userInfo/image",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: auth,
      },
      data: formData,
    });
  };
  const onChangeName = (payload) => {
    setName(payload);
  };
  const onChangePw1 = (payload) => {
    setChangePw(payload);
  };
  const onChangePw2 = (payload) => {
    setChangePw2(payload);
  };
  const changePassword = () => {
    if (changePw === changePw2) {
      Alert.alert("비밀번호 변경 완료");
      setPw(changePw);
      setChangePw("");
      setChangePw2("");
    } else if (changePw === "" || changePw2 === "") {
      Alert.alert("비밀번호를 입력해주세요");
    } else {
      Alert.alert("비밀번호가 일치하지 않습니다.");
    }
  };
  const onPressBtn = () => {
    setModalVisible(!modalVisible);
    axios
      .put(
        "http://10.0.2.2:8080/api/userInfo",
        {
          avgReactTime: response,
          distance,
          id: uniqueId,
          introduce,
          name,
          rating,
          password: pw,
        },
        { headers: { Authorization: `${grant}` + " " + `${access}` } }
      )
      .then((res) => console.log("유저 정보 데이터 전송 성공", pw, res.data));
  };
  const onChangeIntroduce = (payload) => {
    setIntroduce(payload);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <Center>
        <View
          style={{ flex: 0.07, opacity: 0.8, backgroundColor: "gray" }}
        ></View>
        <ScrollView style={{ flex: 13 }}>
          <Container>
            <TitleBar>
              <View style={{ flex: 1 }}>
                <MaterialIcons
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                  name="cancel"
                  size={24}
                  color="black"
                />
              </View>
              <Title>프로필 수정</Title>
              <View style={{ flex: 1, backgroundColor: "white" }}></View>
            </TitleBar>
            <MainBar>
              <ImgView>
                <ProfileImg source={{ uri: img }} />
                <View style={{ position: "relative" }}>
                  <AddPhoto onPress={pickImage}>
                    <Entypo name="camera" size={15} color="white" />
                  </AddPhoto>
                </View>
              </ImgView>
              <Line />
              <FixView>
                <InputView>
                  <Inform>이름</Inform>
                  <Input
                    value={name}
                    placeholder="이름을 입력해주세요..."
                    onChangeText={onChangeName}
                  />
                </InputView>
                <InputView>
                  <Inform>자기소개</Inform>
                  <IntroduceInput
                    value={introduce}
                    placeholder="자기소개..."
                    onChangeText={onChangeIntroduce}
                  />
                </InputView>
                <InputView>
                  <Inform style={{ marginBottom: 10 }}>비밀번호 변경</Inform>
                  <Text style={{ marginHorizontal: 20 }}>비밀번호 입력</Text>
                  <Input
                    value={changePw}
                    onChangeText={onChangePw1}
                    secureTextEntry
                  />
                  <Text style={{ marginHorizontal: 20 }}>한번 더 입력</Text>
                  <Input
                    value={changePw2}
                    onChangeText={onChangePw2}
                    secureTextEntry
                  />
                  <View
                    style={{
                      alignItems: "flex-end",
                      marginHorizontal: 20,
                      marginBottom: 30,
                    }}
                  >
                    <CheckBtn onPress={changePassword}>
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "600",
                          fontSize: 15,
                        }}
                      >
                        확인
                      </Text>
                    </CheckBtn>
                  </View>
                </InputView>
                <Button onPress={onPressBtn}>
                  <Text
                    style={{ color: "white", fontWeight: "600", fontSize: 15 }}
                  >
                    완료
                  </Text>
                </Button>
              </FixView>
            </MainBar>
          </Container>
        </ScrollView>
      </Center>
    </Modal>
  );
};

export default Fix;
