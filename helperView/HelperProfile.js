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
  myIdData,
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

const ListItemText = styled.Text`
  font-size: ${({ isSelected }) => (isSelected ? "20px" : "18px")};
  margin-bottom: 5px;
  color: ${({ isSelected }) => (isSelected ? "#ffffff" : "#333333")};
  font-weight: ${({ isSelected }) => (isSelected ? "bold" : "normal")};
`;
const ListItemTime = styled.Text`
  color: ${({ isSelected }) => (isSelected ? "#ffffff" : "#888888")};
  margin-bottom: 5px;
  font-size: 14px;
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
const OrderButton = styled.TouchableOpacity`
  padding: 0 15px;
  height: 40px;
  border-radius: 10px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
  width: 60%;
  align-self: center;
`;
const ErrandList = styled.TouchableOpacity`
  margin-top: 10px;
  flex-direction: row;
  border-radius: 10px;
  padding: 15px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  margin-bottom: 20px;
  background-color: ${({ isSelected }) =>
    isSelected ? " #rgba(33,150,243,0.7)" : "#ffffff"};
  border-color: ${({ isSelected }) => (isSelected ? "#2980b9" : "#dddddd")};
`;
const ButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const IconButton = styled.TouchableOpacity`
  padding: 5px;
`;

const HelperProfile = ({ route }) => {
  const img = useRecoilValue(imgData);

  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);
  const [chatList, setChatList] = useRecoilState(chatListData);
  const [conversation, setConversation] = useRecoilState(conversationData);
  const myId = useRecoilValue(myIdData);
  const accessToken = useRecoilValue(accessData);

  const [workList, setWorkList] = useRecoilState(workListData);
  const [workListVisible, setWorkListVisible] = useState(false);
  const [selectWork, setSelectWork] = useState(); //내가 선택한 일 정보

  const [orderVisible, setOrderVisible] = useState(false);

  const [indexValue, setIndexValue] = useRecoilState(indexData);

  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [review, setReview] = useState();

  const onViewMyWorkList = async () => {};
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
        axios
          .post(`${BASE_URL}/api/fcm/chatNotification/${data._id}`)
          .then()
          .catch((error) => console.log("caca", error));
        navigation.navigate("Chatting");
      })
      .catch((error) => Alert.alert(error.response.data.message));
    setWorkListVisible(!workListVisible);
  };
  const onPressReview = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/review/${route.params.id}`);
      setReview(res.data);
      setVisible(true);
    } catch (e) {
      Alert.alert(e.response.data.message);
    }
  };
  const onDeleteItem = (itemId) => {
    Alert.alert(
      "삭제 확인",
      "정말로 이 심부름을 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          onPress: () => {
            axios.delete(`${BASE_URL}/api/work/${itemId}`).then(({ data }) => {
              setWorkList(data);
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onViewWork = () => {
    setModalVisible(true);
  };

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
          <EditButton
            onPress={() => {
              setWorkListVisible(!workListVisible);
              onViewMyWorkList();
            }}
          >
            <EditButtonText>내 심부름 목록</EditButtonText>
          </EditButton>
          <EditButton onPress={onPressReview}>
            <EditButtonText>리뷰 보기</EditButtonText>
          </EditButton>
        </ButtonContainer>
        <ReviewModal
          visible={visible}
          setVisible={setVisible}
          review={review}
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
          <CountContainer onPress={onViewWork}>
            <CountText>심부름 보기</CountText>
            <CountValue>
              {route.params.completedWork
                ? `${route.params.completedWork.length}회`
                : "0회"}
            </CountValue>
          </CountContainer>
          <HelperWorkList
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            completedWork={route.params.completedWork}
          />
        </CountBox>
      </Section>

      {/* 심부름 목록 Modal */}
      <Order
        orderVisible={orderVisible}
        setOrderVisible={setOrderVisible}
        titleName="심부름 수정"
        btnText="수정 완료"
        alertText="심부름 수정이 완료되었습니다."
      />
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

          <ScrollView
            style={{
              flex: 1,
              backgroundColor: "#f5f5f5",
              paddingHorizontal: 15,
            }}
          >
            {workList.map((data, index) => {
              // myId와 data.customerId가 같을 때에만 렌더링
              const isCustomer = myId === data.customerId;
              return isCustomer ? (
                <ErrandList
                  key={data.id}
                  isSelected={selectWork === data}
                  onPress={() => {
                    setSelectWork(data);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <ListItemText isSelected={selectWork === data}>
                      {data.title}
                    </ListItemText>
                    <ListItemTime isSelected={selectWork === data}>
                      {data.context}
                    </ListItemTime>
                    <ListItemTime isSelected={selectWork === data}>
                      마감시간 : {data.deadLineTime}시간
                    </ListItemTime>
                  </View>
                  <ButtonsContainer>
                    <IconButton
                      onPress={() => {
                        setOrderVisible(!orderVisible);
                        setIndexValue(index);
                      }}
                    >
                      <MaterialIcons
                        name="edit"
                        size={24}
                        color={selectWork === data ? "#2196f3" : "#333333"}
                      />
                    </IconButton>
                    <IconButton onPress={() => onDeleteItem(data.id)}>
                      <MaterialIcons
                        name="delete"
                        size={24}
                        color={selectWork === data ? "#2196f3" : "#333333"}
                      />
                    </IconButton>
                  </ButtonsContainer>
                </ErrandList>
              ) : null;
            })}

            <OrderButton onPress={onPressOrderBtn}>
              <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
                신청하기
              </Text>
            </OrderButton>
          </ScrollView>
        </View>
      </Modal>
    </Container>
  );
};

export default HelperProfile;
