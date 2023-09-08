import React from "react";
import { Modal, ScrollView, View, Text } from "react-native";
import styled from "styled-components/native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const Background = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  justify-content: center;
  align-items: center;
`;

const Content = styled.View`
  background-color: white;
  width: 85%;
  border-radius: 10px;
  overflow: hidden;
`;

const TitleBar = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background-color: #3498db;
`;

const CloseIcon = styled(Ionicons)`
  margin-right: 10px;
  flex: 1;
`;

const Title = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: white; /* Title text color */
`;

const ReviewList = styled.ScrollView`
  padding: 20px;
`;

const ReviewItem = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  margin-bottom: 15px;
  padding-bottom: 10px;
`;

const ReviewHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

const StarRating = styled.View`
  flex-direction: row;
  margin-right: 5px;
`;

const StarIcon = styled(Ionicons)`
  margin-right: 2px;
`;

const ReviewDate = styled.Text`
  font-size: 14px;
  color: #888;
`;

const ReviewText = styled.Text`
  font-size: 16px;
  color: #333;
`;

const ReviewModal = ({ visible, setVisible, review }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <Background>
        <Content>
          <TitleBar>
            <CloseIcon
              onPress={() => setVisible(!visible)}
              name="arrow-back"
              size={30}
              color="white"
            />
            <Title>리뷰 목록</Title>
            <View style={{ flex: 1 }}></View>
          </TitleBar>
          <ReviewList>
            {review && review.length > 0 ? (
              review?.map((data, index) => (
                <ReviewItem key={index}>
                  <ReviewHeader>
                    <StarRating>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon
                          key={i}
                          name={
                            i < data.rating
                              ? "star"
                              : i === data.rating
                              ? "star-half"
                              : "star-outline"
                          }
                          size={16}
                          color={i <= data.rating ? "#ffcc00" : "#ccc"}
                        />
                      ))}
                    </StarRating>
                  </ReviewHeader>
                  <ReviewText>{data.body}</ReviewText>
                </ReviewItem>
              ))
            ) : (
              <Text
                style={{ color: "#888", alignSelf: "center", fontSize: 15 }}
              >
                작성된 리뷰가 없습니다
              </Text>
            )}
          </ReviewList>
        </Content>
      </Background>
    </Modal>
  );
};

export default ReviewModal;
