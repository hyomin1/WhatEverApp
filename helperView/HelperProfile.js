import { View, Text, Modal, ScrollView, Pressable } from "react-native";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components/native";
import {
  chatListData,
  imgData,
  workListData,
  chatRoomListData,
  conversationData,
  indexData,
} from "../atom";
import axios from "axios";
import { useState } from "react";
import { client } from "../client";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import Order from "../components/Order";
import { BASE_URL } from "../api";

const Container = styled.View`
  flex: 1;
  background-color: white;
`;
const Box = styled.View`
  flex: 1;
`;
const MyProfile = styled.View`
  flex-direction: row;

  padding: 20px 20px;
`;
const ProfileImg = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin-right: 25px;
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
  border: 2px solid rgba(0, 0, 0, 0.7);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;
const BlankBox = styled.View`
  background-color: #dcdde1;
  width: 100%;
  height: 6px;
`;
const CountText = styled.Text`
  font-size: 16px;
  font-weight: 800;
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
const WorkListText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-right: 10px;
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
  margin: 5px 0px;
  align-items: center;
  justify-content: center;
  background-color: #2196f3;
  width: 100%;
`;

const HelperProfile = ({ route }) => {
  const img = useRecoilValue(imgData);

  //const work = useRecoilValue(workData);

  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);
  const [chatList, setChatList] = useRecoilState(chatListData);
  const [conversation, setConversation] = useRecoilState(conversationData);

  const [workList, setWorkList] = useRecoilState(workListData);
  const [workListVisible, setWorkListVisible] = useState(false);
  const [selectWork, setSelectWork] = useState();

  const [orderVisible, setOrderVisible] = useState(false);

  const [indexValue, setIndexValue] = useRecoilState(indexData);

  const navigation = useNavigation();

  const goChat = () => {
    navigation.navigate("Chatting");
  };
  const onPressBtn = async () => {
    //심부름 목록 보기
    axios.get(`${BASE_URL}/api/workList`).then(({ data }) => {
      setWorkList(data);
    });
    console.log("내 심부름 목록", workList);
    setWorkListVisible(!workListVisible);
  };

  const onPressOrderBtn = async () => {
    //심부름 목록 본 후 선택해서 신청
    axios
      .post(`${BASE_URL}/api/conversation/${route.params.id}`, {
        id: selectWork.id,
      })
      .then(({ data }) => {
        console.log("workid", data);
        setConversation(data);
        setChatRoomList([...chatRoomList, data]); //채팅방 목록 보여주기 위함
        setChatList(data);
        client.publish({
          destination: `/pub/work/${data._id}`,
          body: JSON.stringify(selectWork),
        });
        console.log("선택한 심부름", selectWork);
        goChat();
      })
      .catch((error) => console.log(error));
    setWorkListVisible(!workListVisible);
  };
  return (
    <Container>
      <Box>
        <MyProfile>
          <ProfileImg
            source={
              route.params.image
                ? { uri: `data:image/png;base64,${route.params.image}` }
                : require("../images/profile.jpg")
            }
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
        <BlankBox></BlankBox>
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
        <BlankBox></BlankBox>

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
              내 심부름 목록보기
            </Text>
          </Button>
        </View>
        <Modal animationType="slide" visible={workListVisible}>
          <View style={{ flex: 1 }}>
            <TitleBar>
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 10,
                }}
              >
                <MaterialIcons
                  onPress={() => {
                    setWorkListVisible(!workListVisible);
                  }}
                  name="cancel"
                  size={24}
                  color="black"
                />
              </View>

              <Title>나의 심부름 목록</Title>

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
            <View style={{ flex: 10 }}>
              {workList.map((data, index) => (
                <Pressable
                  key={data.id}
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    height: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 30,
                  }}
                  onPress={() => {
                    setSelectWork(data);
                    console.log("선택");
                  }}
                >
                  <WorkListText>제목 : {data.title} </WorkListText>
                  <WorkListText>내용 : {data.context} </WorkListText>
                  <WorkListText>
                    마감시간 : {data.deadLineTime}시간
                  </WorkListText>
                  <Entypo
                    name="pencil"
                    size={24}
                    color="black"
                    onPress={() => {
                      // const copiedWorkList = [...workList];
                      // copiedWorkList[index].title = "title";
                      // setWorkList(copiedWorkList);
                      console.log("수정", data);
                      setOrderVisible(!orderVisible);
                      console.log(index);
                      setIndexValue(index);
                    }}
                  />
                </Pressable>
              ))}
            </View>
            <OrderButton onPress={onPressOrderBtn}>
              <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
                신청하기
              </Text>
            </OrderButton>
          </View>
        </Modal>
      </Box>
    </Container>
  );
};

export default HelperProfile;
