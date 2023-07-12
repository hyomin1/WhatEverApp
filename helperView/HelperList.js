import { Pressable, ScrollView, View } from "react-native";
import styled from "styled-components/native";
import { useRecoilValue } from "recoil";
import { contentData, ratingHelperData, responseHelperData } from "../atom";
import { useState } from "react";
import HelperInform from "./HelperInform";

const Container = styled.View`
  flex: 1;
`;
const TitleBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const MainBar = styled.View`
  flex: 1;
`;
const ChooseText = styled.Text`
  font-size: 13px;
  margin-right: 5px;
  font-weight: 500;
`;

const HelperList = ({ helperVisible, setHelperVisible }) => {
  const distanceData = useRecoilValue(contentData);
  const ratingData = useRecoilValue(ratingHelperData);
  const responseData = useRecoilValue(responseHelperData);

  const [isDistance, setIsDistance] = useState(true);
  const [isRating, setIsRating] = useState(false);
  const [isResponse, setIsResponse] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "#dcdde1" }}>
      <ScrollView>
        <Container>
          <TitleBar>
            <View style={{ flex: 1, paddingHorizontal: 10 }}></View>
            <View
              style={{
                flex: 1,
              }}
            ></View>

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
                <ChooseText style={{ color: isDistance ? "black" : "gray" }}>
                  거리
                </ChooseText>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsDistance(false);
                  setIsRating(true);
                  setIsResponse(false);
                }}
              >
                <ChooseText style={{ color: isRating ? "black" : "gray" }}>
                  평점
                </ChooseText>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsDistance(false);
                  setIsRating(false);
                  setIsResponse(true);
                }}
              >
                <ChooseText style={{ color: isResponse ? "black" : "gray" }}>
                  응답시간
                </ChooseText>
              </Pressable>
            </View>
          </TitleBar>

          <MainBar>
            <View style={{ flex: 2, paddingHorizontal: 10 }}>
              {distanceData && isDistance
                ? distanceData.map((data) => (
                    <HelperInform key={data.id} data={data} />
                  ))
                : null}
              {ratingData && isRating
                ? ratingData.map((data) => (
                    <HelperInform key={data.id} data={data} />
                  ))
                : null}
              {responseData && isResponse
                ? responseData.map((data) => (
                    <HelperInform key={data.id} data={data} />
                  ))
                : null}
            </View>
          </MainBar>
        </Container>
      </ScrollView>
    </View>
  );
};

export default HelperList;
