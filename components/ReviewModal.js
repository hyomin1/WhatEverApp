import React from "react";
import { Modal, Text, TouchableOpacity, ScrollView } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
const Background = styled.View`
  flex: 1;
  background-color: white;
`;

const Content = styled.View`
  background-color: white;
  width: 100%;
  padding: 20px;
  border-radius: 10px;
`;

const TitleBar = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CloseIcon = styled(Ionicons)`
  flex: 1;
`;

const Title = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const EmptyView = styled.View`
  flex: 1;
`;

const ReviewList = styled.View`
  margin-top: 20px;
`;

const ReviewItem = styled.View`
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

const ReviewText = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const ReviewDate = styled.Text`
  font-size: 12px;
  color: #888;
`;

const ReviewModal = ({ visible, setVisible, reviews }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <Background>
        <Content>
          <TitleBar>
            <CloseIcon
              onPress={() => setVisible(!visible)}
              name="arrow-back"
              size={24}
              color="black"
            />
            <Title>리뷰 목록</Title>
            <EmptyView />
          </TitleBar>
          <ReviewList>
            <ScrollView>
              {reviews?.map((review, index) => (
                <ReviewItem key={index}>
                  <ReviewText>{review.text}</ReviewText>
                  <ReviewDate>{review.date}</ReviewDate>
                </ReviewItem>
              ))}
            </ScrollView>
          </ReviewList>
        </Content>
      </Background>
    </Modal>
  );
};

export default ReviewModal;
