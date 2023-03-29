import { Modal, ScrollView, Text, View } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRecoilValue } from "recoil";
import { nameData, ratingData, responseData } from "../atom";

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
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 10px;
`;
const Line = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 0.5px;
  margin-top: 3px;
`;

const HelperList = ({ helperVisible, setHelperVisible }) => {
  const name = useRecoilValue(nameData);
  const response = useRecoilValue(responseData);
  const rating = useRecoilValue(ratingData);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={helperVisible}
      onRequestClose={() => {
        setHelperVisible(!helperVisible);
      }}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 0.3, opacity: 0.8, backgroundColor: "gray" }}
        ></View>
        <ScrollView style={{ backgroundColor: "white" }}>
          <Container>
            <TitleBar>
              <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <MaterialIcons
                  onPress={() => {
                    setHelperVisible(!helperVisible);
                  }}
                  name="cancel"
                  size={24}
                  color="black"
                />
              </View>
              <Title>주변 헬퍼 보기</Title>
              <View style={{ flex: 1 }}></View>
            </TitleBar>
            <Line />
          </Container>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default HelperList;
