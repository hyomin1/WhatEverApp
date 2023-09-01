import React, { useEffect, useState } from "react";
import { View, Text, Modal, Pressable, ScrollView, Alert } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  accessData,
  chatListData,
  chatRoomListData,
  conversationData,
} from "../atom";
import axios from "axios";
import { BASE_URL } from "../api";
import { client } from "../client";
import DetailWork from "./DetailWork";
import DetailUser from "./DetailUser";

const WorkInformation = styled.View`
  margin: 15px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const WorkTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #333333;
`;

const WorkSubtitle = styled.Text`
  font-size: 14px;
  color: #999999;
  margin-top: 5px;
`;
const HighlightedAmout = styled.Text`
  font-size: 16px;
  color: #ffa500;
  font-weight: bold;
`;
const ButtonContainer = styled.View``;
const Button = styled.TouchableOpacity`
  background-color: ${({ bgColor }) => bgColor || "#1e90ff"};
  border-radius: 8px;
  padding: 12px 20px;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ textColor }) => textColor || "#ffffff"};
  text-align: center;
`;

const NearWork = ({ nearWork, setNearWork }) => {
  const [workVisible, setWorkVisible] = useState(false);
  const [userVisible, setUserVisible] = useState(false);

  const navigation = useNavigation();
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);
  const [chatList, setChatList] = useRecoilState(chatListData);
  const [conversation, setConversation] = useRecoilState(conversationData);
  const accessToken = useRecoilValue(accessData);
  const [userInfo, setUserInfo] = useState({});
  const [userWorkList, setUserWorkList] = useState([]);
  const [selectedWorkDetail, setSelectedWorkDetail] = useState(null);
  const [remainingTime, setRemainingTime] = useState([]);

  useEffect(() => {
    if (nearWork) {
      const updateRemainingTime = () => {
        const updatedTime = nearWork.map((data) => {
          if (!data.finished) {
            const elapsedTime = Math.floor(
              (new Date() - new Date(data.createdTime)) / (1000 * 60)
            );
            const remainingMinutes = data.deadLineTime * 60 - elapsedTime;
            return remainingMinutes > 0 ? remainingMinutes : 0;
          }
          return 0;
        });

        setRemainingTime(updatedTime);
        //setNearWork(sortedNearWork);
      };
      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 60000);

      return () => clearInterval(interval);
    }
  }, [nearWork]);

  const onDetailWork = (work) => {
    setSelectedWorkDetail(work);
    setWorkVisible(true);
  };
  const onDetailUser = async (userId) => {
    try {
      const res1 = await axios.get(`${BASE_URL}/api/user/${userId}`);
      setUserInfo(res1.data);
      const res2 = await axios.get(
        `${BASE_URL}/api/workList/byCustomer/${userId}`
      );
      setUserWorkList(res2.data);
      setUserVisible(true);
    } catch (error) {
      console.log(error);
      Alert.alert(error.response.data.meesage);
    }
  };

  const onPressProgress = (data) => {
    axios
      .post(`${BASE_URL}/api/conversation/${data.customerId}`, {
        id: data.id,
      })
      .then((res) => {
        setConversation(res.data);
        setChatRoomList([...chatRoomList, res.data]);
        setChatList(res.data);
        client.publish({
          destination: `/pub/work/${res.data._id}`,
          body: JSON.stringify(data),
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        navigation.navigate("Chatting");
      })
      .catch((error) => console.log("1", error.response.data.message));
    // 진행 요청 로직
  };
  //console.log(nearWork[0].createdTime);

  return (
    <ScrollView>
      {nearWork && nearWork.length > 0 ? (
        nearWork.map((data, index) =>
          !data.finished ? (
            <View key={index}>
              <WorkInformation key={index}>
                <View>
                  <WorkTitle>{data.title}</WorkTitle>
                  <WorkSubtitle>마감시간 {remainingTime[index]}분</WorkSubtitle>
                  <HighlightedAmout>{data.reward}원</HighlightedAmout>
                </View>

                <ButtonContainer>
                  <Button
                    bgColor="#4CAF50"
                    onPress={() => onDetailUser(data.customerId)}
                  >
                    <ButtonText textColor="#ffffff">유저 정보보기</ButtonText>
                  </Button>

                  <Button bgColor="#1e90ff" onPress={() => onDetailWork(data)}>
                    <ButtonText textColor="#ffffff">심부름 상세보기</ButtonText>
                  </Button>
                </ButtonContainer>
              </WorkInformation>
              {workVisible && (
                <DetailWork
                  selectedWork={selectedWorkDetail}
                  workVisible={workVisible}
                  setWorkVisible={setWorkVisible}
                />
              )}
              {userVisible && (
                <DetailUser
                  userInfo={userInfo}
                  userVisible={userVisible}
                  setUserVisible={setUserVisible}
                  userWorkList={userWorkList}
                />
              )}
            </View>
          ) : null
        )
      ) : (
        <View
          style={{
            flex: 1,
            marginTop: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>주변에 심부름이 없습니다</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default NearWork;
