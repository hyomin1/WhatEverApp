import { Pressable, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";

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

const HelperInform = ({ data }) => {
  const navigation = useNavigation();
  return (
    <HelperInformation
      onPress={() =>
        navigation.navigate("HelperProfile", {
          name: data.name,
          introduce: data.introduce,
          rating: data.rating,
          id: data.id,
          image: data.image,
        })
      }
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
            data.image
              ? {
                  uri: `data:image/png;base64,${data.image}`,
                }
              : require("../images/profile.jpg")
          }
          style={{ height: 90, width: 90, borderRadius: 50 }}
        />
      </View>
      <View style={{ flex: 2, paddingTop: 10 }}>
        <Name>{data.name}</Name>
        <Distance>{data.distance.toFixed(2)}m</Distance>
        <Rating>⭐ {data.rating ? data.rating.toFixed(1) : 0}/5</Rating>
        {data.avgReactTime ? (
          <Response>응답시간 {data.avgReactTime}초</Response>
        ) : (
          <Response>응답시간 알 수 없음</Response>
        )}
      </View>
    </HelperInformation>
  );
};
export default HelperInform;
