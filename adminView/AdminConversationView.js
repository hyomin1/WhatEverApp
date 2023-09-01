import { ScrollView, View, Text } from "react-native";
import styled from "styled-components/native";

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
  margin-bottom: 10px;
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

const AdminConversationView = ({ route }) => {
  const { chatList } = route.params;
  console.log(chatList);
  return (
    <Container>
      <ScrollView>
        <ChatView>
          {chatList.map((data, index) =>
            data.messageType === "Work" ? (
              <WorkContiainer
                key={index}
                style={{ justifyContent: "flex-end" }}
              >
                <Time>
                  {data.sendTime
                    ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(
                        11,
                        16
                      )}`
                    : null}
                </Time>
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
                      마감시간 : {JSON.parse(data.message).deadLineTime}시간
                    </MainDescription>
                    <View style={{ flexDirection: "row" }}>
                      <MainDescription>보상금액: </MainDescription>
                      <MoneyText>{JSON.parse(data.message).reward}원</MoneyText>
                    </View>
                  </PaddingView>
                </WorkBubble>
              </WorkContiainer>
            ) : data.messageType === "Chat" ? (
              <View key={index}>
                <View
                  style={{
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  <Time style={{ marginRight: 3, marginBottom: 10 }}>
                    {data.sendTime.slice(0, 10)} {data.sendTime.slice(11, 16)}
                  </Time>
                  <ChatWrapper>
                    <ChatText>{data.message ? data.message : null}</ChatText>
                  </ChatWrapper>
                </View>
              </View>
            ) : (
              data.messageType === "Card" &&
              (data.message === "Accept work" ? (
                <WorkContiainer
                  key={index}
                  style={{ justifyContent: "flex-end" }}
                >
                  <Time>
                    {data.sendTime
                      ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(
                          11,
                          16
                        )}`
                      : null}
                  </Time>
                  <WorkBubble key={index}>
                    <WorkTitleWrapper>
                      <WorkTitle>심부름 수락</WorkTitle>
                    </WorkTitleWrapper>
                    <PaddingView></PaddingView>
                  </WorkBubble>
                </WorkContiainer>
              ) : data.message === "Complete work" ? (
                <WorkContiainer
                  key={index}
                  style={{ justifyContent: "flex-end" }}
                >
                  <Time>
                    {data.sendTime
                      ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(
                          11,
                          16
                        )}`
                      : null}
                  </Time>
                  <WorkBubble key={index}>
                    <WorkTitleWrapper>
                      <WorkTitle>심부름 완료</WorkTitle>
                    </WorkTitleWrapper>
                    <PaddingView></PaddingView>
                  </WorkBubble>
                </WorkContiainer>
              ) : data.message === "Finish Work" ? (
                <WorkContiainer
                  key={index}
                  style={{ justifyContent: "flex-end" }}
                >
                  <Time>
                    {data.sendTime
                      ? `${data.sendTime.slice(0, 10)} ${data.sendTime.slice(
                          11,
                          16
                        )}`
                      : null}
                  </Time>
                  <WorkBubble key={index}>
                    <WorkTitleWrapper>
                      <WorkTitle>심부름 종료</WorkTitle>
                    </WorkTitleWrapper>
                    <PaddingView></PaddingView>
                  </WorkBubble>
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
