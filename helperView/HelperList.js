import { Pressable, ScrollView, View, Text } from "react-native";
import styled from "styled-components/native";
import { useRecoilValue } from "recoil";
import { contentData, ratingHelperData, responseHelperData } from "../atom";
import { useState } from "react";
import HelperInform from "./HelperInform";

const Container = styled.View`
  flex: 1;
`;
const SelectView = styled.View`
  flex: 1;
  flex-direction: row;
  margin-bottom: 10px;
`;
const SelectBtn = styled.TouchableOpacity`
  background-color: white;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-bottom-width: 2px;
`;

const MainBar = styled.View`
  flex: 1;
`;
const ChooseText = styled.Text`
  font-size: 13px;
  margin-right: 5px;
  font-weight: 500;
`;

const HelperList = () => {
  const distanceData = useRecoilValue(contentData);
  const ratingData = useRecoilValue(ratingHelperData);
  const responseData = useRecoilValue(responseHelperData);
  console.log(responseData);
  const [isDistance, setIsDistance] = useState(true);
  const [isRating, setIsRating] = useState(false);
  const [isResponse, setIsResponse] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "#dcdde1" }}>
      <ScrollView>
        <Container>
          <SelectView>
            <SelectBtn
              style={{ borderBottomWidth: isDistance ? 2 : 0 }}
              onPress={() => {
                setIsDistance(true);
                setIsRating(false);
                setIsResponse(false);
              }}
            >
              <ChooseText>거리</ChooseText>
            </SelectBtn>
            <SelectBtn
              style={{ borderBottomWidth: isRating ? 2 : 0 }}
              onPress={() => {
                setIsDistance(false);
                setIsRating(true);
                setIsResponse(false);
              }}
            >
              <ChooseText>평점</ChooseText>
            </SelectBtn>
            <SelectBtn
              style={{ borderBottomWidth: isResponse ? 2 : 0 }}
              onPress={() => {
                setIsDistance(false);
                setIsRating(false);
                setIsResponse(true);
              }}
            >
              <ChooseText>평균 응답시간</ChooseText>
            </SelectBtn>
          </SelectView>

          <MainBar>
            <View style={{ flex: 2, paddingHorizontal: 10 }}>
              {distanceData &&
                isDistance &&
                distanceData.map((data) => (
                  <HelperInform key={data.id} helperData={data} />
                ))}
              {ratingData &&
                isRating &&
                ratingData.map((data) => (
                  <HelperInform key={data.id} helperData={data} />
                ))}
              {responseData &&
                isResponse &&
                responseData.map((data) => (
                  <HelperInform key={data.id} helperData={data} />
                ))}
              {distanceData.length === 0 &&
                ratingData.length === 0 &&
                responseData.length === 0 && (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#777" }}>
                      주변에 헬퍼가 없습니다
                    </Text>
                  </View>
                )}
            </View>
          </MainBar>
        </Container>
      </ScrollView>
    </View>
  );
};

export default HelperList;
