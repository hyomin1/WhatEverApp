import { Pressable, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import axios from "axios";
import { BASE_URL } from "../api";

const Name = styled.Text`
  font-weight: 800;
  margin-bottom: 5px;
  font-size: 17px;
`;
const Distance = styled.Text`
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 10px;
`;
const Rating = styled.Text`
  margin-bottom: 20px;
`;
const Response = styled.Text`
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 13px;
`;
const HelperInformation = styled.TouchableOpacity`
  margin-top: 15px;
  flex-direction: row;
  flex: 1;
  background-color: white;
  border-radius: 20px;
`;

const HelperInform = ({ helperData }) => {
  console.log(helperData);
  const navigation = useNavigation();
  const { name, introduce, rating, id, image, distance, avgReactTime } =
    helperData;
  return (
    <HelperInformation
      onPress={() => {
        axios
          .get(`${BASE_URL}/api/workList/byHelper/${id}`)
          .then(({ data }) => {
            navigation.navigate("HelperProfile", {
              name,
              introduce,
              rating,
              id,
              image,
              completedWork: data,
            });
          })
          .catch((error) => console.log(error.response.data.message));
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={
            image
              ? {
                  uri: `data:image/png;base64,${image}`,
                }
              : require("../images/profile.jpg")
          }
          style={{ height: 90, width: 90, borderRadius: 50 }}
        />
      </View>
      <View style={{ flex: 2, paddingTop: 10 }}>
        <Name>{name}</Name>
        <Distance>{distance.toFixed(2)}m</Distance>
        <Rating>⭐ {rating ? rating.toFixed(1) : 0}/5</Rating>
        {avgReactTime < 1 ? (
          <Response>응답시간 1분 이내</Response>
        ) : avgReactTime >= 1 && avgReactTime <= 60 ? (
          <Response>응답시간 ${avgReactTime}초</Response>
        ) : avgReactTime > 60 ? (
          <Response>응답시간 1시간 이상</Response>
        ) : (
          <Response>응답시간 알 수 없음</Response>
        )}
      </View>
    </HelperInformation>
  );
};
export default HelperInform;
