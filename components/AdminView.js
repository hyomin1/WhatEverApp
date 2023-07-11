import axios from "axios";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";

const AdminView = () => {
  const [reportList, setReportList] = useState();
  const onPressFetch = () => {
    console.log("클릭");
    axios.get("http://10.0.2.2:8080/admin/reportList").then((res) => {
      setReportList(res.data);
      console.log(res.data);
    });
  };
  return (
    <View>
      <Pressable onPress={onPressFetch}>
        <Text>신고내역 불러오기</Text>
      </Pressable>
      {reportList
        ? reportList.map((data, index) => (
            <View key={index}>
              <Text>{data.reportReason}</Text>
              <Text>제목 : {data.work.title}</Text>
            </View>
          ))
        : null}
    </View>
  );
};

export default AdminView;
