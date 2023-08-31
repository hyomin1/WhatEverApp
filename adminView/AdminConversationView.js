import { ScrollView, View } from "react-native";
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

const AdminConversationView = () => {
  return (
    <Container>
      <ScrollView>
        <ChatView>
          <View
            style={{
              justifyContent: "flex-end",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ChatWrapper>
              <ChatText>1</ChatText>
            </ChatWrapper>
          </View>
        </ChatView>
      </ScrollView>
    </Container>
  );
};

export default AdminConversationView;
