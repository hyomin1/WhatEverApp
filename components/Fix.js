import { Text, View, Dimensions, Modal, Pressable } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
//const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const Center = styled.View`
  flex: 1;
`;
const Container = styled.View`
  flex: 8;
  background-color: white;
  width: 100%;
  padding: 0px 10px;
`;
const TitleBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;
const Title = styled.Text`
  font-weight: 600;
  font-size: 18px;
  flex: 1;
  align-items: center;
`;

const Fix = ({ modalVisible, setModalVisible }) => {
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
        <View style={{ flex: 1 }}></View>
        <Container>
          <TitleBar>
            <Pressable style={{ flex: 1 }}>
              <MaterialIcons
                onPress={() => setModalVisible(!modalVisible)}
                name="cancel"
                size={24}
                color="black"
              />
            </Pressable>

            <Title>프로필 수정</Title>
            <View style={{ flex: 1 }}></View>
          </TitleBar>
        </Container>
      </Center>
    </Modal>
  );
};

export default Fix;
