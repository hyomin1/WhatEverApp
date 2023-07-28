import { ScrollView } from "react-native";
import { useRecoilValue } from "recoil";
import { adminData, reportData } from "../atom";
import styled from "styled-components/native";

import { useState } from "react";

import UserHistory from "./UserHistory";
import AdminHistory from "./AdminHistory";

const History = () => {
  const isAdmin = useRecoilValue(adminData);
  const reportList = useRecoilValue(reportData);

  //isAdmin 일 경우 신고내역 보게 하고  유저일 경우 이용내역 view 가르기
  return (
    <ScrollView
      style={{ backgroundColor: "#dcdde1", flex: 1, paddingHorizontal: 20 }}
    >
      {isAdmin ? <AdminHistory /> : <UserHistory />}
    </ScrollView>
  );
};

export default History;
