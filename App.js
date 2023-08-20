import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import * as encoding from "text-encoding";
import Root from "./navigation/Root";
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { fcmTokenData } from "./atom";
import { createGlobalStyle } from "styled-components/native";
import { View } from "react-native";
import { Platform } from "react-native";

export default function App() {
  const queryClient = new QueryClient();

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //background
    console.log("Message handled in the background!", remoteMessage); //remoteMessage.body , remoteMessage.title\
    if (remoteMessage.notification)
      console.log("채팅알람", remoteMessage.notification.body);
    else
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
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Root />
        </NavigationContainer>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
