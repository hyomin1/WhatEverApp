import { useState } from "react";
import { View } from "react-native";
import StarRating from "react-native-star-rating-widget";
import styled from "styled-components/native";

const RatingView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const RatingBtn = styled.Pressable`
  margin-top: 10px;
`;
const BtnText = styled.Text``;

const Rating = ({ isSetStarRating }) => {
  const [rating, setRating] = useState(0);
  console.log(rating);
  return (
    <RatingView>
      <StarRating rating={rating} onChange={setRating} />
      <RatingBtn onPress={() => isSetStarRating((cur) => !cur)}>
        <BtnText>평가 완료</BtnText>
      </RatingBtn>
    </RatingView>
  );
};
export default Rating;
