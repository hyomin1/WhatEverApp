import { ScrollView, Text } from "react-native";
import styled from "styled-components/native";

const WorkInformation = styled.View`
  margin-top: 15px;
  flex: 1;
  background-color: white;
  border-radius: 20px;
  padding: 20px 20px;
`;

const WorkText = styled.Text`
  font-size: 17px;
  margin-bottom: 10px;
  font-weight: 600;
  color: #7f8fa6;
`;

const NearWork = () => {
  return (
    <ScrollView>
      {[1, 2, 3, 4].map((v) => (
        <WorkInformation key={v}>
          <WorkText>{v}</WorkText>
        </WorkInformation>
      ))}
    </ScrollView>
  );
};

export default NearWork;
