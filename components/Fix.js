import { Text, View, Dimensions, Modal, Pressable } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { accessData, grantData, imgData, nameData } from "../atom";
import { useRecoilState } from "recoil";
import { Entypo } from "@expo/vector-icons";
const Center = styled.View`
  flex: 1;
`;
const Container = styled.View`
  flex: 13;
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
`;

const MainBar = styled.View`
  flex: 1;
`;
const ImgView = styled.View`
  flex: 0.8;
  justify-content: center;
  align-items: center;
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
`;
const Input = styled.TextInput`
  height: 40px;
  border-width: 1px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
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

const Fix = ({ modalVisible, setModalVisible }) => {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions(); //권한 요청을 위한 hooks
  const [img, setImg] = useRecoilState(imgData);
  const [access, setAccess] = useRecoilState(accessData);
  const [grant, setGrant] = useRecoilState(grantData);
  const [name, setName] = useRecoilState(nameData);
  const [ok, setOk] = useState(false);
  const auth = grant + " " + access;
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
    /* 
    formData.append("image", {
      uri: localUri,
      name: fileName,
      type,
    });

    await axios({
      method: "post",
      url: "http://10.0.2.2:8080/update/profile",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: auth,
      },
      data: formData,
    });*/
  };
  const onChangeName = (payload) => {
    if (ok) setName(payload);
    else return;
  };
  const onPressBtn = () => {
    setModalVisible(!modalVisible);
    setOk(true);
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
        <View style={{ flex: 1, opacity: 0.8, backgroundColor: "gray" }}></View>
        <Container>
          <TitleBar>
            <View style={{ flex: 1 }}>
              <MaterialIcons
                onPress={() => setModalVisible(!modalVisible)}
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
                <Inform>성별</Inform>
                <Input />
              </InputView>
              <InputView>
                <Inform>출생연도</Inform>
                <Input />
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
      </Center>
    </Modal>
  );
};

export default Fix;
