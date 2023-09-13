import { ScrollView, View, Text } from "react-native";
import { useRecoilValue } from "recoil";
import styled from "styled-components/native";
import { adminWorkData } from "../atom";
import { useEffect } from "react";
import { useState } from "react";

const Container = styled.View`
  flex: 1;
  background-color: #e0e0e0;
`;
const ChatView = styled.ScrollView`
  flex: 1;
  padding: 20px 5px;
`;
const ChatWrapper = styled.View`
  background-color: #0fbcf9;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  padding: 10px 15px;
`;
const ChatText = styled.Text`
  color: white;
  font-size: 17px;
`;
const WorkContiainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
`;
const WorkBubble = styled.View`
  background-color: white;
  border-radius: 10px;
  margin: 5px;
  width: 50%;
  margin-bottom: 10px;
`;
const WorkTitleWrapper = styled.View`
  background-color: #0fbcf9;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 30px;
`;
const WorkTitle = styled.Text`
  font-size: 12px;
  font-weight: bold;
  margin: 4px 0px;
  margin-left: 6px;
`;
const PaddingView = styled.View`
  padding: 20px 10px;
`;
const MainText = styled.Text`
  color: #888;
  font-size: 12px;
`;
const MainTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;
const Divider = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  margin: 8px 0;
`;
const MainDescription = styled.Text`
  font-size: 13px;
  color: #555;
  font-weight: bold;
`;
const MoneyText = styled(MainDescription)`
  color: #007bff;
`;
const WorkText = styled.Text`
  color: #555;
  font-size: 14px;
  margin-bottom: 6px;
`;
const Time = styled.Text`
  color: gray;
  margin-bottom: 10px;
  font-size: 12px;
`;
const ProfileView = styled.View`
  flex-direction: row;
  //margin-bottom: 220px;
  margin: 0px 5px;
`;
const ProfileImage = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: white;
  justify-content: center;
  align-items: center;
  margin-right: 3px;
  margin-left: 3px;
`;
const Name = styled.Text`
  font-weight: bold;
`;

const AdminConversationView = ({ route }) => {
  const chatList = route.params.chatList;
  const adminWork = useRecoilValue(adminWorkData);
  const report = route.params.report;
  const { reportedUserId, reportUserId } = report;

  const [isCreator, setIsCreator] = useState(false);
  const [myName, setMyName] = useState("");

  useEffect(() => {
    if (chatList.creatorId == reportUserId) {
      setIsCreator(true);
    }

    if (isCreator == true) {
      setMyName(chatList.creatorName);
    } else {
      setMyName(chatList.participatorName);
    }
  }, []);

  return (
    <Container>
      <ScrollView>
        <ChatView>
          {chatList.chatList.map((data, index) =>
            data.messageType === "Work" ? (
              <WorkContiainer
                key={index}
                style={{
                  justifyContent:
                    data.senderName === myName ? "flex-end" : "flex-start",
                }}
              >
                {data.senderName === myName ? (
                  <Time>
                    {data.sendTime
                      ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(
                          11,
                          16
                        )}`
                      : null}
                  </Time>
                ) : null}
                {data.senderName === myName ? null : (
                  <ProfileView style={{ marginBottom: 150 }}>
                    <ProfileImage>
                      <Text>사진</Text>
                    </ProfileImage>
                    <Name>{data.senderName}</Name>
                  </ProfileView>
                )}
                <WorkBubble key={index}>
                  <WorkTitleWrapper>
                    <WorkTitle>심부름 요청서</WorkTitle>
                  </WorkTitleWrapper>
                  <PaddingView>
                    <MainText>심부름 요청서</MainText>
                    <MainTitle>{JSON.parse(data.message).title}</MainTitle>
                    <Divider />
                    <MainText>상세 정보입니다</MainText>
                    <MainDescription>
                      {JSON.parse(data.message).context}
                    </MainDescription>
                    <MainDescription>
                      마감시간 : {JSON.parse(data.message).deadLineTime}H
                    </MainDescription>
                    <View style={{ flexDirection: "row" }}>
                      <MainDescription>보상금액: </MainDescription>
                      <MoneyText>{JSON.parse(data.message).reward}원</MoneyText>
                    </View>
                  </PaddingView>
                </WorkBubble>
                {data.senderName === myName ? null : (
                  <Time>
                    {data.sendTime
                      ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(
                          11,
                          16
                        )}`
                      : null}
                  </Time>
                )}
                {data.senderName === myName ? (
                  <ProfileView style={{ marginBottom: 150 }}>
                    <Name>{data.senderName}</Name>
                    <ProfileImage>
                      <Text>사진</Text>
                    </ProfileImage>
                  </ProfileView>
                ) : null}
              </WorkContiainer>
            ) : data.messageType === "Chat" ? (
              <View key={index}>
                <View
                  style={{
                    justifyContent:
                      data.senderName === myName ? "flex-end" : "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 3,
                  }}
                >
                  {data.senderName === myName ? (
                    <Time style={{ marginRight: 3, marginTop: 20 }}>
                      {data.sendTime.slice(0, 10)} {data.sendTime.slice(11, 16)}
                    </Time>
                  ) : null}
                  {data.senderName === myName ? null : (
                    <ProfileView>
                      <ProfileImage>
                        <Text>사진</Text>
                      </ProfileImage>
                      <Name>{data.senderName}</Name>
                    </ProfileView>
                  )}
                  <ChatWrapper>
                    <ChatText>{data.message ? data.message : null}</ChatText>
                  </ChatWrapper>
                  {data.senderName === myName ? null : (
                    <Time style={{ marginRight: 3, marginTop: 20 }}>
                      {data.sendTime.slice(0, 10)} {data.sendTime.slice(11, 16)}
                    </Time>
                  )}
                  {data.senderName === myName ? (
                    <ProfileView>
                      <Name>{data.senderName}</Name>
                      <ProfileImage>
                        <Text>사진</Text>
                      </ProfileImage>
                    </ProfileView>
                  ) : null}
                </View>
              </View>
            ) : (
              data.messageType === "Card" &&
              (data.message === "Accept work" ? (
                <WorkContiainer
                  key={index}
                  style={{
                    justifyContent:
                      data.senderName === myName ? "flex-end" : "flex-start",
                  }}
                >
                  {data.senderName === myName ? (
                    <Time>
                      {data.sendTime
                        ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(
                            11,
                            16
                          )}`
                        : null}
                    </Time>
                  ) : null}
                  {data.senderName === myName ? null : (
                    <ProfileView style={{ marginBottom: 120 }}>
                      <ProfileImage>
                        <Text>사진</Text>
                      </ProfileImage>
                      <Name>{data.senderName}</Name>
                    </ProfileView>
                  )}
                  <WorkBubble key={index}>
                    <WorkTitleWrapper>
                      <WorkTitle>심부름 수락</WorkTitle>
                    </WorkTitleWrapper>
                    <PaddingView>
                      <MainTitle>{adminWork.title}</MainTitle>
                      <Divider />
                      <MainDescription>{adminWork.context}</MainDescription>
                      <MainDescription>
                        마감시간 : {adminWork.deadLineTime}H
                      </MainDescription>
                      <View style={{ flexDirection: "row" }}>
                        <MainDescription>보상금액: </MainDescription>
                        <MoneyText>{adminWork.reward}원</MoneyText>
                      </View>
                    </PaddingView>
                  </WorkBubble>
                  {data.senderName === myName ? null : (
                    <Time>
                      {data.sendTime
                        ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(
                            11,
                            16
                          )}`
                        : null}
                    </Time>
                  )}
                  {data.senderName === myName ? (
                    <ProfileView style={{ marginBottom: 120 }}>
                      <Name>{data.senderName}</Name>
                      <ProfileImage>
                        <Text>사진</Text>
                      </ProfileImage>
                    </ProfileView>
                  ) : null}
                </WorkContiainer>
              ) : data.message === "Complete work" ? (
                <WorkContiainer
                  key={index}
                  style={{
                    justifyContent:
                      data.senderName === myName ? "flex-end" : "flex-start",
                  }}
                >
                  {data.senderName === myName ? (
                    <Time>
                      {data.sendTime
                        ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(
                            11,
                            16
                          )}`
                        : null}
                    </Time>
                  ) : null}
                  {data.senderName === myName ? null : (
                    <ProfileView style={{ marginBottom: 120 }}>
                      <ProfileImage>
                        <Text>사진</Text>
                      </ProfileImage>
                      <Name>{data.senderName}</Name>
                    </ProfileView>
                  )}
                  <WorkBubble key={index}>
                    <WorkTitleWrapper>
                      <WorkTitle>심부름 완료</WorkTitle>
                    </WorkTitleWrapper>
                    <PaddingView>
                      <MainTitle>{adminWork.title}</MainTitle>
                      <Divider />
                      <MainDescription>{adminWork.context}</MainDescription>
                      <MainDescription>
                        마감시간 : {adminWork.deadLineTime}H
                      </MainDescription>
                      <View style={{ flexDirection: "row" }}>
                        <MainDescription>보상금액: </MainDescription>
                        <MoneyText>{adminWork.reward}원</MoneyText>
                      </View>
                    </PaddingView>
                  </WorkBubble>
                  {data.senderName === myName ? null : (
                    <Time>
                      {data.sendTime
                        ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(
                            11,
                            16
                          )}`
                        : null}
                    </Time>
                  )}
                  {data.senderName === myName ? (
                    <ProfileView style={{ marginBottom: 120 }}>
                      <Name>{data.senderName}</Name>
                      <ProfileImage>
                        <Text>사진</Text>
                      </ProfileImage>
                    </ProfileView>
                  ) : null}
                </WorkContiainer>
              ) : data.message === "Finish Work" ? (
                <WorkContiainer
                  key={index}
                  style={{
                    justifyContent:
                      data.senderName === myName ? "flex-end" : "flex-start",
                  }}
                >
                  {data.senderName === myName ? (
                    <Time>
                      {data.sendTime
                        ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(
                            11,
                            16
                          )}`
                        : null}
                    </Time>
                  ) : null}
                  {data.senderName === myName ? null : (
                    <ProfileView style={{ marginBottom: 120 }}>
                      <ProfileImage>
                        <Text>사진</Text>
                      </ProfileImage>
                      <Name>{data.senderName}</Name>
                    </ProfileView>
                  )}
                  <WorkBubble key={index}>
                    <WorkTitleWrapper>
                      <WorkTitle>심부름 종료</WorkTitle>
                    </WorkTitleWrapper>
                    <PaddingView>
                      <MainTitle>{adminWork.title}</MainTitle>
                      <Divider />
                      <MainDescription>{adminWork.context}</MainDescription>
                      <MainDescription>
                        마감시간 : {adminWork.deadLineTime}H
                      </MainDescription>
                      <View style={{ flexDirection: "row" }}>
                        <MainDescription>보상금액: </MainDescription>
                        <MoneyText>{adminWork.reward}원</MoneyText>
                      </View>
                    </PaddingView>
                  </WorkBubble>
                  {data.senderName === myName ? null : (
                    <Time>
                      {data.sendTime
                        ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(
                            11,
                            16
                          )}`
                        : null}
                    </Time>
                  )}
                  {data.senderName === myName ? (
                    <ProfileView style={{ marginBottom: 120 }}>
                      <Name>{data.senderName}</Name>
                      <ProfileImage>
                        <Text>사진</Text>
                      </ProfileImage>
                    </ProfileView>
                  ) : null}
                </WorkContiainer>
              ) : null)
            )
          )}
        </ChatView>
      </ScrollView>
    </Container>
  );
};

export default AdminConversationView;
