import { View, Modal, Text } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { IntroduceData } from "../atom";

const Container = styled.View`
  flex: 1;
`;
const Main = styled.View`
  flex: 1;
`;
const MainContainer = styled.View`
  flex: 13;
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
const Line = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 0.7px;
  margin: 10px 0;
`;
const Input = styled.TextInput`
  height: 160px;
  border-width: 1px;
  border-radius: 10px;
`;
const Button = styled.Pressable`
  padding: 0 15px;
  height: 40px;
  border-radius: 10px;
  margin: 50px 0;
  align-items: center;
  justify-content: center;
  background-color: black;
`;

const Introduce = ({ introduceVisible, setIntroduceVisible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={introduceVisible}
      onRequestClose={() => setIntroduceVisible(!introduceVisible)}
    >
      <Container>
        <View style={{ flex: 1, opacity: 0.8, backgroundColor: "gray" }}></View>
        <MainContainer>
          <Main>
            <TitleBar>
              <View>
                <MaterialIcons
                  onPress={() => setIntroduceVisible(!introduceVisible)}
                  name="cancel"
                  size={24}
                  color="black"
                />
              </View>
              <View style={{ flex: 1, backgroundColor: "white" }}></View>
            </TitleBar>

            <View style={{ flex: 1.5, backgroundColor: "white" }}>
              <Line />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  marginTop: 15,
                  marginBottom: 25,
                }}
              >
                자기소개
              </Text>
              <Input />
              <Button onPress={() => setIntroduceVisible(!introduceVisible)}>
                <Text
                  style={{ color: "white", fontWeight: "600", fontSize: 15 }}
                >
                  완료
                </Text>
              </Button>
            </View>
            <View style={{ flex: 1, backgroundColor: "white" }}></View>
          </Main>
        </MainContainer>
      </Container>
    </Modal>
  );
};
export default Introduce;
