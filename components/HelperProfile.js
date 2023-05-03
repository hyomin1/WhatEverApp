import { View, Text, Pressable } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components/native";
import {
  ConversationData,
  accessData,
  chatListData,
  grantData,
  imgData,
  workData,
} from "../atom";
import axios from "axios";
import { useEffect } from "react";
import { client } from "../client";
import { useNavigation } from "@react-navigation/native";
import StompJs from "@stomp/stompjs";
import { accessToken } from "../token";

const Container = styled.View`
  flex: 1;
  background-color: white;
`;
const Box = styled.View`
  flex: 1;
`;
const MyProfile = styled.View`
  flex-direction: row;
  border-bottom-color: black;
  border-bottom-width: 0.5px;
  padding: 20px 20px;
`;
const ProfileImg = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-right: 20px;
`;
const Name = styled.Text`
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: 800;
`;
const ContentWrapper = styled.View`
  margin-bottom: 20px;
`;
const ContentBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 20px 20px;
  margin-bottom: 20px;
`;
const ContentText = styled.Text`
  font-size: 18px;
  font-weight: 600;
`;
const CountWrapper = styled.View`
  padding: 0px 20px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const Count = styled.View`
  padding: 0px 20px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border: 1px solid rgba(0, 0, 0, 0.7);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;
const CountText = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;
const Button = styled.Pressable`
  padding: 0 15px;
  height: 40px;
  border-radius: 10px;
  margin-top: 150px;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
  width: 60%;
`;
const HelperProfile = ({ route }) => {
  const img = useRecoilValue(imgData);

  const work = useRecoilValue(workData);
  const grant = useRecoilValue(grantData);
  const access = useRecoilValue(accessData);
  const [chatList, setChatList] = useRecoilState(chatListData);

  const [conversation, setConverSation] = useRecoilState(ConversationData);

  const headers = {
    Authorization: `${grant}` + " " + `${access}`,
  };
  const navigation = useNavigation();

  const goChat = () => {
    navigation.navigate("Chatting");
  };
  const onPressBtn = async () => {
    axios
      .post(`http://10.0.2.2:8080/api/conversation/${route.params.id}`, {
        id: work.id,
      })
      .then((res) => {
        console.log("workid", res.data);
        setConverSation(res.data);
        setChatList([...chatList, res.data]);
        client.publish({
          destination: `/pub/work/${res.data._id}`,
          body: JSON.stringify(res.data),
        });
        goChat();
      })
      .catch((error) => console.log(error));
  };
  return (
    <Container>
      <Box>
        <MyProfile>
          <ProfileImg
            source={{ uri: `data:image/png;base64,${route.params.image}` }}
          />
          <View style={{ paddingVertical: 20 }}>
            <Name>{route.params.name}</Name>
            {route.params.rating ? (
              <Text>⭐ {route.params.rating.toFixed(1)}/5</Text>
            ) : (
              <Text>⭐ 0/5</Text>
            )}
          </View>
        </MyProfile>
        <ContentWrapper>
          <ContentBox>
            <ContentText>헬퍼소개</ContentText>
          </ContentBox>
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {route.params.introduce}
            </Text>
          </View>
        </ContentWrapper>

        <ContentBox>
          <ContentText>요청정보</ContentText>
        </ContentBox>

        <CountWrapper>
          <Count>
            <CountText>총 심부름수</CountText>
            <Text>0</Text>
          </Count>
          <Count>
            <CountText>요청한 심부름 수</CountText>
            <Text>0</Text>
          </Count>
        </CountWrapper>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Button onPress={onPressBtn}>
            <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
              신청하기
            </Text>
          </Button>
        </View>
      </Box>
    </Container>
  );
};

export default HelperProfile;
