import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useState } from "react";
import { Modal, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { useRecoilValue } from "recoil";
import styled from "styled-components/native";
import { BASE_URL } from "../api";
import { adminTokenData, adminWorkData } from "../atom";

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ContentContainer = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Input = styled.TextInput`
  border: 1px solid gray;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${(props) => (props.primary ? "#3498db" : "lightgray")};
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

const HandleReport = ({ modalVisible, setModalVisible, report }) => {
  const [reason, setReason] = useState("");
  const [code, setCode] = useState(0);
  const adminToken = useRecoilValue(adminTokenData);
  const navigation = useNavigation();
  const adminWork = useRecoilValue(adminWorkData);

  const onHandleReport = async () => {
    setReason("");
    try {
      const token = await AsyncStorage.getItem("adminToken");
      const res = await axios.put(
        `${BASE_URL}/admin/report/execute`,
        {
          executeDetail: reason,
          reportExecuteCode: code,
          conversationId: report.conversationId,
          createdTime: report.createdTime,
          id: report.id,
          reportUserId: report.reportUserId,
          reportedUserId: report.reportedUserId,
          workId: report.workId,
          reportReason: report.reportReason,
          reportTitle: report.reportTitle,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigation.navigate("AdminTab", { screen: "AdminView" });
    } catch (error) {
      console.log(error);
    }
    setModalVisible(false);
  };
  const result =
    adminWork.workProceedingStatus === 3
      ? ["기각", "3일정지", "7일정지", "30일정지", "영구정지"]
      : ["기각", "환불", "3일정지", "7일정지", "30일정지", "영구정지"];
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <ModalContainer>
        <ContentContainer>
          <Title>신고 처리</Title>
          <Input
            multiline
            numberOfLines={4}
            placeholder="신고 처리 사유를 적어주세요..."
            value={reason}
            onChangeText={(text) => setReason(text)}
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <SelectDropdown
              buttonStyle={{
                borderWidth: 1,
                backgroundColor: "white",
                borderColor: "lightgray",
                borderRadius: 10,
                height: 40,
              }}
              data={result}
              onSelect={(selectedItem, index) => {
                if (adminWork.workProceedingStatus === 3) {
                  if (index >= 1) {
                    setCode(index + 2);
                  } else {
                    setCode(index + 1);
                  }
                } else {
                  setCode(index + 1);
                }
              }}
              buttonTextAfterSelection={(selectedItem) => selectedItem}
              defaultButtonText="선택"
              renderDropdownIcon={() => <Text style={{ fontSize: 16 }}>▼</Text>}
            />
          </View>

          <ButtonContainer>
            <ActionButton onPress={onHandleReport} primary>
              <ButtonText>처리하기</ButtonText>
            </ActionButton>
            <ActionButton onPress={() => setModalVisible(false)}>
              <ButtonText>닫기</ButtonText>
            </ActionButton>
          </ButtonContainer>
        </ContentContainer>
      </ModalContainer>
    </Modal>
  );
};

export default HandleReport;
