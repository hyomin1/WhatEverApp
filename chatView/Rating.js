import { useState } from "react";
import { Text, View } from "react-native";
import StarRatings from "./react-star-ratings";

const Rating = () => {
  const [rating, setRating] = useState();
  return (
    <View>
      <Text>별점</Text>
      <StarRatings
        rating={rating}
        starRatedColor="blue"
        numberOfStars={5}
        name="rating"
      />
    </View>
  );
};
export default Rating;
