import { Text, View, Modal, ScrollView, Alert } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { imgData, myImgData } from "../atom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../api";

const Background = styled.View`
  flex: 1;
  background-color: white;
`;
const TitleBar = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

const CloseIcon = styled(Ionicons)`
  flex: 1;
  color: black;
`;

const Title = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const Line = styled.View`
  height: 1px;
  background-color: #ccc;
`;

const MainContent = styled.View`
  padding: 20px;
`;

const ProfileImageContainer = styled.View`
  align-items: center;
`;

const ProfileImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const CameraButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 0px;
  right: 125px;
  background-color: #3498db;
  padding: 5px;
  border-radius: 15px;
`;

const CameraIcon = styled(Entypo)`
  color: white;
`;

const SaveButton = styled.TouchableOpacity`
  width: 50%;
  background-color: #0fbcf9;
  padding: 10px;
  align-items: center;
  border-radius: 5px;
  margin-top: 20px;
  align-self: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 15px;
`;
const InputView = styled.View`
  margin-bottom: 20px;
`;

const Inform = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const PasswordContainer = styled.View``;

const PasswordText = styled.Text`
  margin: 5px 0;
`;

const CheckBtn = styled.TouchableOpacity`
  align-self: flex-end;
  padding: 10px 20px;
  background-color: #0fbcf9;
  border-radius: 5px;
  margin-top: 15px;
`;

const Input = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const ProfileFix = ({
  modalVisible,
  setModalVisible,
  myImg,
  user,
  setUser,
}) => {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions(); //권한 요청을 위한 hooks
  const [img, setImg] = useRecoilState(imgData);
  const { avgReactTime, distance, id, introduce, name, rating, password } =
    user;

  const [changePw, setChangePw] = useState(); //비밀번호 수정용1
  const [changePw2, setChangePw2] = useState(); //비밀번호 수정용2
  const setMyImg = useSetRecoilState(myImgData);

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
      url: `${BASE_URL}/api/userInfo/image`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
  };
  const onChangeName = (payload) => {
    setUser((prev) => ({
      ...prev,
      name: payload,
    }));
  };
  const onChangePw1 = (payload) => {
    setChangePw(payload);
  };
  const onChangePw2 = (payload) => {
    setChangePw2(payload);
  };

  const changePassword = async () => {
    if (changePw === changePw2 && changePw !== "" && changePw2 !== "") {
      try {
        const res = await axios.put(
          `${BASE_URL}/api/user?password=${changePw}`
        );
        Alert.alert("비밀번호가 변경되었습니다.");
      } catch (error) {
        console.log("비번변경에러", error);
      }
      //비밀번호 변경 버튼 누를시에도 서버에 보내줘야함 어떻게 추가할지 생각
      setUser((prev) => ({
        ...prev,
        password: changePw,
      }));
      setChangePw("");
      setChangePw2("");
    } else if (changePw === "" || changePw2 === "") {
      Alert.alert("비밀번호를 입력해주세요");
    } else {
      Alert.alert("비밀번호가 일치하지 않습니다.");
    }
  };
  const onUpdateProfile = async () => {
    setModalVisible(!modalVisible);
    await axios.get(`${BASE_URL}/api/userInfo`).then((res) => {
      setMyImg(res.data.image);
    });
    await axios
      .put(`${BASE_URL}/api/userInfo`, {
        avgReactTime,
        distance,
        id,
        introduce,
        name,
        rating,
        password,
      })
      .then((res) => console.log("유저 정보 데이터 전송 성공"));
  };
  const onChangeIntroduce = (payload) => {
    setUser((prev) => ({
      ...prev,
      introduce: payload,
    }));
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
      <Background>
        <ScrollView>
          <TitleBar>
            <CloseIcon
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              name="arrow-back"
              size={24}
              color="black"
            />

            <Title>프로필 수정</Title>
            <View style={{ flex: 1, backgroundColor: "white" }}></View>
          </TitleBar>
          <Line />
          <MainContent>
            <ProfileImageContainer>
              <ProfileImage
                source={
                  myImg
                    ? { uri: `data:image/png;base64,${myImg}` }
                    : require("../images/profile.jpg")
                }
              />

              <CameraButton onPress={pickImage}>
                <CameraIcon name="camera" size={15} color="white" />
              </CameraButton>
            </ProfileImageContainer>

            <InputView>
              <Inform>이름</Inform>
              <Input
                value={user.name}
                placeholder="이름을 입력해주세요..."
                onChangeText={onChangeName}
              />
            </InputView>
            <InputView>
              <Inform>자기소개</Inform>
              <Input
                value={user.introduce}
                placeholder="자기소개..."
                onChangeText={onChangeIntroduce}
                style={{ height: 100 }}
                multiline
                numberOfLines={1}
              />
            </InputView>
            <InputView>
              <Inform>비밀번호 변경</Inform>
              <PasswordContainer>
                <PasswordText>비밀번호 입력</PasswordText>
                <Input
                  value={changePw}
                  onChangeText={onChangePw1}
                  secureTextEntry
                  placeholder="새 비밀번호 입력"
                />
              </PasswordContainer>
              <PasswordContainer>
                <PasswordText>한번 더 입력</PasswordText>
                <Input
                  value={changePw2}
                  onChangeText={onChangePw2}
                  secureTextEntry
                  placeholder="새 비밀번호 확인"
                />
              </PasswordContainer>
              <CheckBtn onPress={changePassword}>
                <ButtonText>비밀번호 변경</ButtonText>
              </CheckBtn>
            </InputView>
          </MainContent>

          <SaveButton onPress={onUpdateProfile}>
            <ButtonText>프로필 수정 완료</ButtonText>
          </SaveButton>
        </ScrollView>
      </Background>
    </Modal>
  );
};

export default ProfileFix;
