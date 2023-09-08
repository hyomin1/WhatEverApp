import { Modal, TouchableOpacity, Alert, Text, View } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../api";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  accessData,
  chatListData,
  chatRoomListData,
  conversationData,
} from "../atom";
import { client } from "../client";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Card = styled.View`
  width: 80%;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 5;
`;

const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #333;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #555;
  margin-top: 10px;
  margin-bottom: 3px;
`;

const Content = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
  margin-left: 5px;
`;

const ProgressButton = styled.Pressable`
  background-color: #1e90ff;
  border-radius: 8px;
  padding: 12px;
  align-items: center;
`;

const ProgressButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
`;
const MapBtnView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const MapBtnText = styled.Text`
  color: blue;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const DetailWork = ({
  workVisible,
  setWorkVisible,
  selectedWork,
  address,
  address2,
}) => {
  const setConversation = useSetRecoilState(conversationData);
  const setChatRoomList = useSetRecoilState(chatRoomListData);
  const setChatList = useSetRecoilState(chatListData);
  const accessToken = useRecoilValue(accessData);
  const navigation = useNavigation();

  const onPressProgress = async (selectedWork) => {
    const { customerId, id } = selectedWork;

    try {
      const res = await axios.post(
        `${BASE_URL}/api/conversation/${customerId}`,
        {
          id,
        }
      );
      setConversation(res.data);
      setChatRoomList((prev) => [...prev, res.data]);
      setChatList(res.data);
      client.publish({
        destination: `/pub/work/${res.data._id}`,
        body: JSON.stringify(selectedWork),
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      navigation.navigate("Chatting");
    } catch (error) {
      console.log("진행요청", error);
      Alert.alert(error.response.data.message);
    }
  };

  return (
    <Modal animationType="slide" visible={workVisible} transparent>
      <Container>
        <Card>
          <TitleWrapper>
            <Title>상세보기</Title>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setWorkVisible(false);
              }}
            >
              <AntDesign name="closecircleo" color="#333" size={24} />
            </TouchableOpacity>
          </TitleWrapper>

          {selectedWork && (
            <>
              <Label>제목</Label>
              <Content>{selectedWork.title}</Content>
              <Label>마감 시간</Label>
              <Content>{selectedWork.deadLineTime}H</Content>
              <Label>상세 내용</Label>
              <Content>{selectedWork.context}</Content>
              <Label>금액</Label>
              <Content>{selectedWork.reward}원</Content>
              <MapBtnView>
                <Label>도착지</Label>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("WorkMap", {
                      work: selectedWork,
                      destination: true,
                    });
                    setWorkVisible(false);
                  }}
                >
                  <MapBtnText>지도 보기</MapBtnText>
                </TouchableOpacity>
              </MapBtnView>

              <Content>
                {address.city} {address.borough} {address.quarter}{" "}
                {address.road}
              </Content>
              {address2.city !== "" &&
              address2.borough !== "" &&
              address2.quarter !== "" &&
              address2.road !== "" ? (
                <View>
                  <MapBtnView>
                    <Label>심부름 장소</Label>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("WorkMap", {
                          work: selectedWork,
                          destination: false,
                        });
                        setWorkVisible(false);
                      }}
                    >
                      <MapBtnText>지도 보기</MapBtnText>
                    </TouchableOpacity>
                  </MapBtnView>

                  <Content>
                    {" "}
                    {address2.city} {address2.borough} {address2.quarter}{" "}
                    {address2.road}
                  </Content>
                </View>
              ) : null}

              <ProgressButton onPress={() => onPressProgress(selectedWork)}>
                <ProgressButtonText>진행 요청</ProgressButtonText>
              </ProgressButton>
            </>
          )}
        </Card>
      </Container>
    </Modal>
  );
};

export default DetailWork;
