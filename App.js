import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React from "react";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import * as encoding from "text-encoding";
import Root from "./navigation/Root";
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { Alert, LogBox } from "react-native";
import axios from "axios";
import {
  chatListData,
  historyReportData,
  historyWorkData,
  myImgData,
  nearWorkData,
  userData,
} from "./atom";

import { BASE_URL } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

let navigation;

export default function App() {
  const setChatList = useSetRecoilState(chatListData);
  const setNearWork = useSetRecoilState(nearWorkData);
  const setUser = useSetRecoilState(userData);
  const setMyImg = useSetRecoilState(myImgData);
  const setHistoryWork = useSetRecoilState(historyWorkData);
  const setHistoryReport = useSetRecoilState(historyReportData);
  const instance = axios.create();
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //background
    const token = await AsyncStorage.getItem("authToken");
    if (
      remoteMessage.data.routeType === "ConversationView" ||
      remoteMessage.data.routeType === "conversationView"
    ) {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/conversation/${remoteMessage.data.routeData}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setChatList(res.data);
        navigation.navgiate("Chatting");
      } catch (error) {
        console.log(error);
        Alert.alert(error.response.data.message);
      }
    } else if (remoteMessage.data.routeType === "nearByView") {
      try {
        const res = await axios.get(`${BASE_URL}/api/workList/nearBy`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNearWork(res.data);
        navigation.navigate("Tabs", {
          screen: "헬퍼보기",
          params: {
            isNearWork: true,
          },
        });
      } catch (error) {
        console.log(error);
        Alert.alert(error.response.data.message);
      }
    } else if (remoteMessage.data.routeType === "finishWorkView") {
      try {
        const res = await axios.get(`${BASE_URL}/api/workList/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistoryWork(res.data);
        navigation.navigate("Tabs", { screen: "이용내역" });
      } catch (error) {
        console.log(error);
        Alert.alert(error.response.data.message);
      }
    } else if (remoteMessage.data.routeType === "myReviewView") {
      try {
        const res = await axios.get(`${BASE_URL}/api`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setMyImg(res.data.image);
        navigation.navigate("Profile");
      } catch (error) {
        console.log(error);
        Alert.alert(error.response.data.message);
      }
    } else if (remoteMessage.data.routeType === "reportView") {
      try {
        const res1 = await axios.get(`${BASE_URL}/api/workList/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistoryWork(res1.data);
        const res2 = await axios.get(`${BASE_URL}/api/report/reportList`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistoryReport(res2.data);
        navigation.navigate("Tabs", { screen: "이용내역" });
      } catch (error) {
        console.log(error);
        Alert.alert(error.response.data.message);
      }
    } else if (remoteMessage.data.routeType === "MAIN_VIEW") {
      navigation.navgiate("Tabs", { screen: "헬퍼보기" });
    }

    if (remoteMessage.notification) {
      //console.log("채팅알람fff", remoteMessage.notification.body);
      //navigation.navigate("Chatting");
    } else
      console.log(
        "background title : " +
          remoteMessage.data.title +
          "\n body : " +
          remoteMessage.data.body
      );
  });

  useEffect(() => {
    //getToken();
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      //foreground
      console.log("Message handled in the foreground!", remoteMessage); //remoteMessage.body , remoteMessage.title\
      if (remoteMessage.notification)
        console.log("채팅알람", remoteMessage.notification.body);
      else
        console.log(
          "foretitle : " +
            remoteMessage.data.title +
            "\n body : " +
            remoteMessage.data.body
        );
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const status = error.response ? error.response.status : null;
        //console.log(error.response);
        if (status === 401 && error.response.data.message === "ReIssueToken") {
          delete error.config.headers.Authorization;
          try {
            const res = await axios.put(`${BASE_URL}/reIssueToken`);
            if (res.status === 200) {
              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${res.data.accessToken}`;
              await AsyncStorage.setItem("authToken", res.data.accessToken);
              return axios.request(error.config);
            }
          } catch (error) {
            console.log(error);
          }
        } else if (status === 403) {
          delete error.config.headers.Authorization;
          console.log("403 ", error);
          navigation.navigate("Login");
        }

        console.log("asdfasdf");
        return Promise.reject(error);
      }
    );
  }, []);
  return (
    <NavigationContainer ref={(ref) => (navigation = ref)}>
      <Root />
    </NavigationContainer>
  );
}
