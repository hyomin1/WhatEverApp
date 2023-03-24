import { View, Text, Image, Pressable, TextInput } from "react-native";
import styled from "styled-components/native";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import { accessData, grantData } from "../atom";
import { useRecoilState } from "recoil";
import BottomSheet from "@gorhom/bottom-sheet";
import RenderContent from "./RenderContent";
import Animated from "react-native-reanimated";

const BASE_PROFILE =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQEg8NDRMVEhAOEhAQEhEOERYNDhAYFBEWFxUTFRcZKCggGBonHRMVITEhJykrLi4uGCIzODMsNzQtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKcApgMBIgACEQEDEQH/xAAcAAEBAAIDAQEAAAAAAAAAAAAABAEGBQcIAwL/xABGEAACAQECBg8FBQYHAQAAAAAAAQIDBBEFBhIVMYIHITNBUVNhY3GBkaKy0eETIkPBwjJCc5OxFBcjJCVUNVJikrPw8Rb/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A0TCmEasKs4Qm0k9pbT0q/fJM71+MfYvIYb3er0rwohAuzvX4x9i8hnevxj7F5EIAuzvX4x9i8hnevxj7F5EIAuzvX4x9i8hnevxj7F5EIAuzvX4x9i8hnevxj7F5EIAuzvX4x9i8hnevxj7F5EIAuzvX4x9i8hnevxj7F5EIAuzvX4x9i8hnevxj7F5EIAuzvX4x9i8hnevxj7F5EIAuzvX4x9i8hnevxj7F5EIA2XF61zqup7STeSldvLbfB1A+GKmmr0R/VgDj8N7vV6V4UQl2G93qdXhRCAAAAAAAAAAAAAAAAAAAAAAAABz2Kumr0R/Vgxitpq9Ef1ZkDj8N7vU6vCiEuw1u9Tq8KIQAAAAAAAAF5XYMGV67us9KdT8OLkl0vQjsHEDY6VaMLZhBNU5e9TobcXJf5p8C5Dtiy2WFKKp0oRhCKuUYRUYrqQHnt4k4Ruv/AGSrdp0R8ziLbYKtB5NenOm/9cXG/oe+eobj4Wyx060XTrQjUjLacZxU0+pgeXAdk4/bHSoRnbMH3ulG+VSj9qUFvyi9LXIdbJgAAAAAAAAc7itpq6vzAxX01dX5gCDDW7VOrwohLcNbtU6vCiIAAAAAAGz7HWAlbbZCE1fSo/xai4clq5dbuNYO1dg6kv56p95exinyPLb8KA7USuVy0Le3jXMbscaGDor2l8601fClD7T5W95cpsh5xx3whK0W61VJO9KpKnFcEY7SV3UBt62X62Ve7NDIv0Kcsq7pu+R2BipjXQwjByovJqQ+3Sn9uPKuGPKedLjnsR7fOhbrLODfvVIwkl96Mtppgei5RvTTW09KejbPPWyBgRWK2VacFdSqXVafIpaV1NNHoU6n2cKay7FPflGtF9EXBrxMDq4AAAAAAAHOYsaaur8wMWNNXV+YAgw1u1Tq8KIi3DO7VOrwoiAAAAAABXYsJVqGV+z1Z08u7K9nNwyrtF93SSADlP8A6O2f3Nb82Rxs5Ntyk723e29tt8J+QAN62KMXZWi0xtk1/Bsryr3onO73Yro0s1bF/A9S216dmo6Zv3pfdhFaZvkuPReBcF07JRp2agroU0lyt77fC29sC46c2a7cp2iz2daaNOUnyOo1tdkE+s7SxgwxTsVCpaqz92C2loc5b0Vys85YYwjO1Vqtpqv36snJ8C4EuRK5ARgAAAAAAA5vFnTV1fmBizpq6vzAEOGd2qavhREW4Z3apq+FEQAAAAAAAAAzGLbSSvbaSS0u/QjBtOxlYI18IWdTV8aeVVuehuCbW103Adp7HWKqsFDLqJftNdKVR78FvU0+Tf5TbKlRRTlJpRim23tJJaWz9M6y2X8ZpU0sG0Xc6sVOtJbTyW7lDrud4Gn7IeNTt9fIpv8AlqDcaa3pvfqPp3uQ1IIAAAAAAAAAc3i18XV+YMYt/F1fqAEWGN2qavhREW4Y3apq+FEQAAAAAAAAA3bYf/xCP4VXwmknJYAw1VsVVWmz3ZajKPvrKV0lc9oD0wdB7K0r8JV0/uxopflRfzKv3pYQ4aX5Zq2HMK1LZWnaq93tKmSnkrJj7sVFbXQgIAAAAAAAAAABzWLfxdX6gMXPi6v1GAI8MbtPV8KIizDG7T1fCiMAAAAAAAAAc9iTgGOELSrLObgnCcsqKTfuo4E3bYgX9Qj+FV8KA2n90NH+5qf7InXON+Bo2G11bJCTnGmqbUpJJvKgpaF0npG7/tx0Fsqr+p2noo/8MANSAAAAAAAAAAHM4u/F1PqAxd+LqfUAIsL7tPV8KIyzC+7T1fCiMAAAAAAAAAfulVlB5UJOL4YNxfaj8ACnOFbjan5kvM+NSpKTyptyb35Nyk+tn4AAAAAAAAAAAAczi98XU+owMXvi6n1ACPC+6z1fCiMswvus9XwojAAAAAAAAAAAAAAAAAAAAAAAAA5jF/4up9QMYv8AxdT6jIH1tWC/aSc3K6+7aUb9Cu4T45k5zuepkAYzLznc9RmXnO56mQBjMvOdz1GZec7nqZAGMy853PUZl5zuepkAYzLznc9RmXnO56mQBjMvOdz1GZec7nqZAGMy853PUZl5zuepkAYzLznc9RmXnO56mQBjMvOdz1GZec7nqZAGMy853PUZk5zueoAFdgsXssrbysq7eue1/wCgAD//2Q==";

const Container = styled.View`
  flex: 1;
  background-color: white;
`;
const Box = styled.View`
  flex: 3;
`;
const MyProfile = styled.View`
  flex-direction: row;
  margin: 20px 15px;
  position: relative;
`;
const ProfileImg = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-right: 20px;
`;
const Name = styled.Text`
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: 800;
`;
const AddPhoto = styled.Pressable`
  padding: 8px;
  align-items: center;
  background-color: gray;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  position: absolute;
  bottom: 5px;
`;
const ProfileBtn = styled.Pressable`
  padding: 0 15px;
  height: 40px;
  margin: 5px 20px;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
`;
const ProfileText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 15px;
`;

const Profile = () => {
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions(); //권한 요청을 위한 hooks
  const [img, setImg] = useState(BASE_PROFILE);
  const [access, setAccess] = useRecoilState(accessData);
  const [grant, setGrant] = useRecoilState(grantData);
  const auth = grant + " " + access;
  const pickImage = async () => {
    //const formData = new FormData();
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
      console.log("취소함");
      return null;
    }
    setImg(result.uri);
    const localUri = result.uri;
    const fileName = localUri.split("/").pop();
    const match = /\.(\w+)$/.exec(fileName ?? "");
    const type = match ? `image/${match[1]}` : `image`;
    const formData = new FormData();
    /* console.log(result.uri);
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
  const sheetRef = useRef(null);

  return (
    <Container>
      <Box>
        <MyProfile>
          <ProfileImg source={{ uri: img }} />
          <AddPhoto onPress={pickImage}>
            <MaterialIcons name="add-a-photo" size={15} color="black" />
          </AddPhoto>
          <View style={{ paddingVertical: 20 }}>
            <Name>이름</Name>
            <Text>⭐ 3.7/5</Text>
          </View>
        </MyProfile>
        <ProfileBtn onPress={() => sheetRef.current.snapTo(0)}>
          <ProfileText>회원정보 수정</ProfileText>
        </ProfileBtn>
        <BottomSheet ref={sheetRef} index={1} snapPoints={["25%", "50%"]}>
          <View>
            <Text>성공</Text>
          </View>
        </BottomSheet>
        <TextInput />
      </Box>
      <Box>
        <Text>2</Text>
      </Box>
      <Box>
        <Text>3</Text>
      </Box>
    </Container>
  );
};
export default Profile;
