import { View } from "react-native";
import styled from "styled-components/native";

const PaddingView = styled.View`
  padding: 20px 10px;
`;
const MainText = styled.Text`
  color: #888;
  font-size: 12px;
  margin-bottom: ${(props) => (props.mb ? "20px" : "0")};
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

const ErrandRequest = ({ messageData }) => {
  return (
    <PaddingView>
      <MainText>심부름 요청서</MainText>
      <MainTitle>{messageData.title}</MainTitle>
      <Divider />
      <MainText mb={true}>상세 정보</MainText>
      <MainDescription>{messageData.context}</MainDescription>
      <MainDescription>
        마감시간 : {messageData.deadLineTime}시간
      </MainDescription>
      <View style={{ flexDirection: "row" }}>
        <MainDescription>보상금액: </MainDescription>
        <MoneyText>{messageData.reward}원</MoneyText>
      </View>
    </PaddingView>
  );
};

export default ErrandRequest;
