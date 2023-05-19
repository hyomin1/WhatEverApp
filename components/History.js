import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import axios from "axios";

const History = () => {
  useEffect(() => {
    axios.get("http://10.0.2.2:8080/api/workList").then((res) => {
      console.log(res.data);
    });
    console.log("his");
  }, []);

  return (
    <View>
      <Text>이용내역</Text>
    </View>
  );
};

export default History;
