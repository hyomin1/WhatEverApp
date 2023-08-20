import { AntDesign } from "@expo/vector-icons";
import styled from "styled-components/native";
import { View, Dimensions, Text } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BtnContainer = styled.View`
  position: absolute;
  width: 50%;
  bottom: 7%;
  left: 50%;
`;
const Button = styled.TouchableOpacity`
  padding: 0 15px;
  height: 45px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: #0fbcf9;
`;

const RequestBtn = ({ setOrderVisible, orderVisible }) => {
  return (
    <BtnContainer style={{ marginLeft: -SCREEN_WIDTH / 4 }}>
      <Button onPress={() => setOrderVisible(!orderVisible)}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AntDesign
            name="shoppingcart"
            size={24}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={{ color: "white", fontWeight: "800", fontSize: 15 }}>
            심부름 등록하기
          </Text>
        </View>
      </Button>
    </BtnContainer>
  );
};
export default RequestBtn;
