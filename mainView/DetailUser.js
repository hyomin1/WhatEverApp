import { Modal, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;
const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const DetailUser = ({ userInfo, userVisible, setUserVisible }) => {
  console.log("우ㅠ저정보 전송", userInfo);

  return (
    <Modal animationType="slide" visible={userVisible} transparent>
      <Container>
        <TitleWrapper>
          <Title>유저 정보</Title>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setUserVisible(false);
            }}
          >
            <AntDesign name="closecircleo" color="#333" size={24} />
          </TouchableOpacity>
        </TitleWrapper>
      </Container>
    </Modal>
  );
};
export default DetailUser;
