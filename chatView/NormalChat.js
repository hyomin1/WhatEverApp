import styled from "styled-components/native";
import { View } from "react-native";

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

const NormalChat = ({ myName, data }) => {
  return (
    <View>
      {data.senderName === myName ? (
        <View
          style={{
            justifyContent: "flex-end",
            flexDirection: "row",
            alignItems: "center",
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
          }}
        >
          <ChatWrapper2>
            <ChatText2>{data.message}</ChatText2>
          </ChatWrapper2>
          <Time style={{ marginLeft: 5 }}>
            {data.sendTime.slice(0, 10)} {data.sendTime.slice(11, 16)}
          </Time>
        </View>
      )}
    </View>
  );
};
export default NormalChat;
