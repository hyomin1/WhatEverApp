import styled from "styled-components/native";
import { Modal, View, ScrollView, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Postcode from "@actbase/react-daum-postcode";
import { useState } from "react";
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
  padding: 0px 15px;
  margin-top: 20px;
`;
const MainText = styled.Text`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
`;
const TitleInput = styled.TextInput`
  height: 40px;
  border-width: 0.9px;
  padding: 10px;
  border-radius: 5px;
`;

const Order = ({ orderVisible, setOrderVisible }) => {
  const [isModal, setModal] = useState(false);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={orderVisible}
      onRequestClose={() => setOrderVisible(!orderVisible)}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 0.07, opacity: 0.8, backgroundColor: "gray" }}
        ></View>
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
                <TitleInput placeholder="제목을 입력해주세요..." />
                <Text>목적지 주소</Text>
                <Postcode
                  style={{ width: 320, height: 320 }}
                  jsOptions={{ animation: true }}
                  onSelected={(data) => alert(JSON.stringify(data))}
                />
              </View>
            </MainBar>
          </Container>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default Order;
