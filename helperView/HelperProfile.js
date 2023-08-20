import { View, Text, Modal, ScrollView, Pressable, Alert } from "react-native";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components/native";
import {
  chatListData,
  imgData,
  workListData,
  chatRoomListData,
  conversationData,
  indexData,
  accessData,
} from "../atom";
import axios from "axios";
import { useState } from "react";
import { client } from "../client";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import Order from "../components/Order";
import { BASE_URL } from "../api";
import ReviewModal from "../components/ReviewModal";
import HelperWorkList from "./HelperWorkList";

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const ProfileView = styled.View`
  background-color: white;
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
`;

const ProfileHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImg = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin-right: 20px;
`;

const ProfileInfo = styled.View``;

const Name = styled.Text`
  font-size: 24px;
  font-weight: 700;
`;
const ButtonContainer = styled.View`
  margin-top: 20px;
  flex-direction: row;
  justify-content: space-between;
`;
const EditButton = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 10px 20px;
  border-radius: 8px;
  align-self: flex-start;
  margin-top: 10px;
`;

const EditButtonText = styled.Text`
  color: white;
  font-weight: 600;
`;
const Section = styled.View`
  background-color: white;
  margin: 0 20px 20px;
  padding: 20px;
  border-radius: 10px;
`;

const SectionHeader = styled.Text`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
`;
const CountBox = styled.View`
  padding: 0 20px;
  margin-top: 20px;
`;

const CountContainer = styled.TouchableOpacity`
  border-radius: 10px;
  background-color: #3498db;
  padding: 15px 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const CountText = styled.Text`
  font-size: 16px;
  font-weight: 800;
  color: white;
`;

const CountValue = styled.Text`
  font-size: 16px;
  color: white;
`;

const WorkListText = styled.Text`
  font-size: 17px;
  font-weight: 800;
  margin-right: 10px;
  margin-bottom: 5px;
`;
const TitleBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  background-color: white;
`;
const Title = styled.Text`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
`;
const Line = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 0.5px;
  margin-top: 3px;
`;
const OrderButton = styled.Pressable`
  padding: 0 15px;
  height: 40px;
  border-radius: 10px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
  width: 100%;
`;
const ErrandList = styled.Pressable`
  margin-top: 15px;
  flex-direction: row;
  border-radius: 20px;
  border: 1px solid white;
`;

const HelperProfile = ({ route }) => {
  const img = useRecoilValue(imgData);

  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);
  const [chatList, setChatList] = useRecoilState(chatListData);
  const [conversation, setConversation] = useRecoilState(conversationData);

  const accessToken = useRecoilValue(accessData);

  const [workList, setWorkList] = useRecoilState(workListData);
  const [workListVisible, setWorkListVisible] = useState(false);
  const [selectWork, setSelectWork] = useState(); //내가 선택한 일 정보

  const [orderVisible, setOrderVisible] = useState(false);

  const [indexValue, setIndexValue] = useRecoilState(indexData);

  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const goChat = () => {
    navigation.navigate("Chatting");
  };
  const onPressBtn = async () => {
    //심부름 목록 보기
    axios
      .get(`${BASE_URL}/api/workList`)
      .then(({ data }) => {
        setWorkList(data);
      })
      .catch((error) => console.log(error.response.data.message));
    setWorkListVisible(!workListVisible);
  };

  const onPressOrderBtn = async () => {
    //심부름 목록 본 후 선택해서 신청
    axios
      .post(`${BASE_URL}/api/conversation/${route.params.id}`, {
        id: selectWork.id,
      })
      .then(({ data }) => {
        setConversation(data);
        setChatRoomList([...chatRoomList, data]); //채팅방 목록 보여주기 위함
        setChatList(data);
        client.publish({
          destination: `/pub/work/${data._id}`,
          body: JSON.stringify(selectWork),
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        goChat();
      })
      .catch((error) => console.log(error));
    setWorkListVisible(!workListVisible);
  };
  const onPressReview = () => {
    setVisible(true);
    axios
      .get(`${BASE_URL}/api/review/${route.params.id}`)
      .then((res) => console.log(res.data))
      .catch((error) => console.log(error));
  };
  const reviews = [
    {
      text: "good",
      date: "1.33",
    },
    {
      text: "bad",
      date: "2.57",
    },
  ];
  return (
    <Container>
      <ProfileView>
        <ProfileHeader>
          <ProfileImg
            source={
              route.params.image
                ? { uri: `data:image/png;base64,${route.params.image}` }
                : require("../images/profile.jpg")
            }
          />
          <ProfileInfo>
            <Name>{route.params.name}</Name>
            {route.params.rating ? (
              <Text>⭐ {route.params.rating.toFixed(1)}/5</Text>
            ) : (
              <Text>⭐ 0/5</Text>
            )}
          </ProfileInfo>
        </ProfileHeader>

        <ButtonContainer>
          <EditButton onPress={onPressBtn}>
            <EditButtonText>내 심부름 목록</EditButtonText>
          </EditButton>
          <EditButton onPress={onPressReview}>
            <EditButtonText>리뷰 보기</EditButtonText>
          </EditButton>
        </ButtonContainer>
        <ReviewModal
          visible={visible}
          setVisible={setVisible}
          reviews={reviews}
        />
      </ProfileView>

      <Section>
        <SectionHeader>헬퍼소개</SectionHeader>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {route.params.introduce}
          </Text>
        </View>
      </Section>

      <Section>
        <SectionHeader>심부름 수행</SectionHeader>
        <CountBox>
          <CountContainer onPress={() => setModalVisible(true)}>
            <CountText>심부름 보기</CountText>
            <CountValue>0</CountValue>
          </CountContainer>
          <HelperWorkList
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        </CountBox>
      </Section>

      {/* 심부름 목록 Modal */}
      <Modal animationType="slide" visible={workListVisible}>
        <View style={{ flex: 1 }}>
          <TitleBar>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 10,
              }}
            >
              <Ionicons
                onPress={() => {
                  setWorkListVisible(!workListVisible);
                }}
                name="arrow-back"
                size={24}
                color="black"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Title>나의 심부름 목록</Title>
            </View>
            <View style={{ flex: 1 }}></View>
          </TitleBar>
          <Line />

          <Order
            orderVisible={orderVisible}
            setOrderVisible={setOrderVisible}
            titleName="심부름 수정"
            btnText="수정 완료"
            alertText="심부름 수정이 완료되었습니다."
          />
          <View
            style={{
              flex: 10,
              backgroundColor: "#dcdde1",
              paddingHorizontal: 15,
            }}
          >
            {workList.map((data, index) => (
              <ErrandList
                key={data.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                  backgroundColor: "white",
                  // backgroundColor: selectWork === data ? "gray" : "white",
                  borderColor: selectWork === data ? "blue" : "white",
                }}
                onPress={() => {
                  setSelectWork(data);
                }}
              >
                <View style={{ flex: 1 }}>
                  <WorkListText>제목 : {data.title} </WorkListText>
                  <WorkListText>내용 : {data.context} </WorkListText>
                  <WorkListText>
                    마감시간 : {data.deadLineTime}시간
                  </WorkListText>
                  <Pressable
                    onPress={() => {
                      axios
                        .delete(`${BASE_URL}/api/work/${data.id}`)
                        .then((res) => {
                          setWorkList(res.data);
                          console.log(res.data);
                        });
                    }}
                  >
                    <Text>삭제</Text>
                  </Pressable>
                </View>

                <Entypo
                  name="pencil"
                  size={24}
                  color="black"
                  onPress={() => {
                    //console.log("수정", data);
                    setOrderVisible(!orderVisible);
                    //console.log(index);
                    setIndexValue(index);
                  }}
                />
              </ErrandList>
            ))}
            <OrderButton onPress={onPressOrderBtn}>
              <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
                신청하기
              </Text>
            </OrderButton>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default HelperProfile;
