import axios from "axios";
import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";
import styled from "styled-components/native";
import { BASE_URL } from "../api";
import { useNavigation } from "@react-navigation/native";
import { client } from "../client";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  accessData,
  chatListData,
  chatRoomListData,
  conversationData,
} from "../atom";
import { MaterialIcons } from "@expo/vector-icons";

const Wrapper = styled.View`
  flex: 1;
`;

const HeaderView = styled.View`
  flex: 1;
  flex-direction: row;
  padding: 10px 10px;
`;
const Title = styled.Text`
  font-weight: 600;
  font-size: 17px;
  margin-bottom: 10px;
`;

const WorkInformation = styled.Pressable`
  margin-top: 15px;
  flex: 1;
  background-color: white;
  border-radius: 20px;
  padding: 20px 20px;
`;

const WorkText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: black;
`;

const NearWork = ({ nearWork }) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListData);
  const [chatList, setChatList] = useRecoilState(chatListData);
  const [conversation, setConversation] = useRecoilState(conversationData);
  const accessToken = useRecoilValue(accessData);
  const onPressWork = () => {
    setVisible((cur) => !cur);
  };
  const goChat = () => {
    navigation.navigate("Chatting");
  };

  const onPressProgress = (data) => {
    console.log("진행요청");
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
        goChat();
      });
  };
  console.log(nearWork);

  return (
    <ScrollView>
      {nearWork && nearWork.length > 0 ? (
        nearWork.map((data, index) =>
          !data.finished ? (
            <View key={index} style={{ paddingHorizontal: 10 }}>
              <WorkInformation onPress={onPressWork} key={index}>
                <WorkText>제목 : {data.title}</WorkText>
              </WorkInformation>
              <Modal animationType="slide" visible={visible}>
                <Wrapper>
                  <HeaderView>
                    <View style={{ flex: 1 }}>
                      <MaterialIcons
                        onPress={() => {
                          setVisible((cur) => !cur);
                        }}
                        name="cancel"
                        size={24}
                        color="black"
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,

                        alignItems: "center",
                      }}
                    >
                      <Title>상세보기</Title>
                    </View>
                    <View style={{ flex: 1 }}></View>
                  </HeaderView>
                  <Pressable onPress={() => setVisible((cur) => !cur)}>
                    <WorkText>{data.context}</WorkText>
                  </Pressable>
                  <Pressable onPress={() => onPressProgress(data)}>
                    <WorkText>진행 요청</WorkText>
                  </Pressable>
                </Wrapper>
              </Modal>
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
