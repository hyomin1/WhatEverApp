import { Modal, ScrollView, Text, View } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRecoilValue } from "recoil";
import { contentData } from "../atom";
import { AntDesign } from "@expo/vector-icons";

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
  justify-content: center;
  align-items: center;
`;
const Line = styled.View`
  border-bottom-color: black;
  border-bottom-width: 0.5px;
  margin-top: 3px;
`;
const MainBar = styled.View`
  flex: 1;
`;
const HelperInform = styled.View`
  margin-top: 15px;
  flex-direction: row;
  flex: 1;
  border-bottom-color: black;
  border-bottom-width: 0.5px;
`;
const Name = styled.Text`
  font-weight: 600;
  margin-bottom: 5px;
`;
const Distance = styled.Text`
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 10px;
`;
const Rating = styled.Text`
  margin-bottom: 20px;
`;

const HelperList = ({ helperVisible, setHelperVisible }) => {
  const content = useRecoilValue(contentData);

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
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Title>주변 헬퍼 보기</Title>
              </View>

              <View style={{ flex: 1 }}></View>
            </TitleBar>
            <Line />
            <MainBar>
              <View style={{ flex: 2 }}>
                {content
                  ? content.map((data) => (
                      <HelperInform key={data.id}>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text>사진</Text>
                        </View>
                        <View style={{ flex: 2 }}>
                          <Name>{data.name}</Name>
                          <Distance>{data.distance.toFixed(2)}m</Distance>
                          <Rating>
                            {data.rating ? (
                              <View style={{ flexDirection: "row" }}>
                                <AntDesign
                                  name="star"
                                  size={15}
                                  color="yellow"
                                />
                                <AntDesign
                                  name="star"
                                  size={15}
                                  color="yellow"
                                />
                              </View>
                            ) : null}
                          </Rating>
                        </View>
                      </HelperInform>
                    ))
                  : null}
              </View>
            </MainBar>
          </Container>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default HelperList;
