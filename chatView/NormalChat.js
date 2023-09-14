import styled from "styled-components/native";
import { View, Text } from "react-native";

const ChatWrapper = styled.View`
  background-color: #0fbcf9;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  padding: 10px 15px;
  margin-bottom: 5px;
`;
const ChatWrapper2 = styled(ChatWrapper)`
  background-color: white;
`;
const ChatText = styled.Text`
  color: white;
  font-size: 17px;
`;
const ChatText2 = styled(ChatText)`
  color: black;
`;
const Time = styled.Text`
  color: gray;
  margin-top: 5px;
  font-size: 12px;
`;
const ProfileImage = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: white;
  justify-content: center;
  align-items: center;
  margin-right: 3px;
`;

const NormalChat = ({ myName, data, prevData }) => {
  return (
    <View>
      {data.senderName === myName ? (
        <View
          style={{
            justifyContent: "flex-end",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Time style={{ marginRight: 5 }}>
            {data.sendTime.slice(0, 10)} {data.sendTime.slice(11, 16)}
          </Time>
          <ChatWrapper>
            <ChatText>{data.message ? data.message : null}</ChatText>
          </ChatWrapper>
        </View>
      ) : (
        <View
          style={{
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {prevData &&
            prevData.senderName === data.senderName &&
            prevData.messageType !== "Card" ? null : (
              <View style={{ flexDirection: "row", marginRight: 10 }}>
                <ProfileImage>
                  <Text>사진</Text>
                </ProfileImage>
                <Text style={{ color: "black", fontWeight: "bold" }}>
                  {data.senderName}
                </Text>
              </View>
            )}
            {prevData && prevData.senderName === data.senderName ? (
              prevData.messageType === "Card" ? (
                <ChatWrapper2>
                  <ChatText2>{data.message}</ChatText2>
                </ChatWrapper2>
              ) : (
                <ChatWrapper2 style={{ marginLeft: 80 }}>
                  <ChatText2>{data.message}</ChatText2>
                </ChatWrapper2>
              )
            ) : (
              <ChatWrapper2>
                <ChatText2>{data.message}</ChatText2>
              </ChatWrapper2>
            )}
          </View>

          <Time style={{ marginLeft: 5 }}>
            {data.sendTime.slice(0, 10)} {data.sendTime.slice(11, 16)}
          </Time>
        </View>
      )}
    </View>
  );
};
export default NormalChat;
