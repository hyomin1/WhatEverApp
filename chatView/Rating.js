import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Alert } from "react-native";
import styled from "styled-components/native";
import axios from "axios";
import StarRating from "react-native-star-rating-widget"; // 올바른 StarRating 컴포넌트를 가져온다고 가정합니다.
import { BASE_URL } from "../api";

const RatingView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
`;

const RatingContainer = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 5;
`;

const RatingBtn = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 14px 28px;
  border-radius: 8px;
  align-self: center;
  margin-top: 20px;
`;

const BtnText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const ReviewInput = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 14px;
  width: 100%;
  margin-top: 20px;
  background-color: white;
`;

const Rating = ({ isSetStarRating, workId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const onChangeReview = (payload) => {
    setReview(payload);
  };

  const onPressComplete = () => {
    isSetStarRating((cur) => !cur);
    axios
      .post(`${BASE_URL}/api/review/${workId}`, {
        rating,
        body: review,
      })
      .then((res) => {})
      .catch((error) => Alert.alert(error.response.data.message));
  };

  return (
    <RatingView>
      <RatingContainer>
        <StarRating rating={rating} onChange={setRating} />
      </RatingContainer>
      <ReviewInput
        onChangeText={onChangeReview}
        placeholder="리뷰를 작성해주세요."
        multiline
      />
      <RatingBtn onPress={onPressComplete}>
        <BtnText>평가 완료</BtnText>
      </RatingBtn>
    </RatingView>
  );
};

export default Rating;
