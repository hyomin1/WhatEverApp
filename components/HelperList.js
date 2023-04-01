import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRecoilValue } from "recoil";
import { contentData, winRatData, winResData } from "../atom";

import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
`;
const TitleBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  background-color: white;
  border-bottom-color: black;
  border-bottom-width: 0.5px;
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
const HelperInform = styled.Pressable`
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
const Response = styled.Text`
  margin-bottom: 20px;
`;
const ChooseText = styled.Text`
  font-size: 12px;
  margin-right: 5px;
`;

const HelperList = ({ helperVisible, setHelperVisible }) => {
  const distanceData = useRecoilValue(contentData);
  const ratingData = useRecoilValue(winRatData);
  const responseData = useRecoilValue(winResData);

  const [isDistance, setIsDistance] = useState(true);
  const [isRating, setIsRating] = useState(false);
  const [isResponse, setIsResponse] = useState(false);

  const navigation = useNavigation();



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
              <View
                style={{
                  flex: 1,
                }}
              >
                <Title>주변 헬퍼 보기</Title>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <Pressable
                  onPress={() => {
                    setIsDistance(true);
                    setIsRating(false);
                    setIsResponse(false);
                  }}
                >
                  <ChooseText>거리</ChooseText>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setIsDistance(false);
                    setIsRating(true);
                    setIsResponse(false);
                  }}
                >
                  <ChooseText>평점</ChooseText>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setIsDistance(false);
                    setIsRating(false);
                    setIsResponse(true);
                  }}
                >
                  <ChooseText>응답시간</ChooseText>
                </Pressable>
              </View>
            </TitleBar>

            <MainBar>
              <View style={{ flex: 2 }}>
                {distanceData && isDistance
                  ? distanceData.map((data) => (
                      <HelperInform
                        key={data.id}
                        onPress={() =>
                          navigation.navigate("HelperProfile", {
                            name: data.name,
                            introduce: data.introduce,
                            rating: data.rating,
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
                          <Text>사진</Text>
                        </View>
                        <View style={{ flex: 2 }}>
                          <Name>{data.name}</Name>
                          <Distance>{data.distance.toFixed(2)}m</Distance>
                          <Rating>
                            ⭐ {data.rating ? data.rating.toFixed(1) : 0}/5
                          </Rating>
                          <Response>응답시간 {data.avgReactTime}초</Response>
                        </View>
                      </HelperInform>
                    ))
                  : null}
                {ratingData && isRating
                  ? ratingData.map((data) => (
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
                            ⭐ {data.rating ? data.rating.toFixed(1) : 0}/5
                          </Rating>
                          <Response>응답시간 {data.avgReactTime}초</Response>
                        </View>
                      </HelperInform>
                    ))
                  : null}
                {responseData && isResponse
                  ? responseData.map((data) => (
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
                            ⭐ {data.rating ? data.rating.toFixed(1) : 0}/5
                          </Rating>
                          <Response>응답시간 {data.avgReactTime}초</Response>
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
