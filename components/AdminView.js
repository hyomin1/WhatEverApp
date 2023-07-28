import axios from "axios";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { BASE_URL } from "../api";
import Main from "../mainView/Main";
import { useNavigation } from "@react-navigation/native";

const AdminView = () => {
  const [reportList, setReportList] = useState();

  const onPressFetch = () => {
    console.log("클릭");
  };

  return (
    // <View>
    //   <Pressable onPress={onPressFetch}>
    //     <Text>신고내역 불러오기</Text>
    //   </Pressable>
    //   {reportList
    //     ? reportList.map((data, index) => (
    //         <View key={index}>
    //           <Text>{data.reportReason}</Text>
    //           <Text>제목 : {data.work.title}</Text>
    //         </View>
    //       ))
    //     : null}
    // </View>
    <View></View>
  );
};

export default AdminView;
