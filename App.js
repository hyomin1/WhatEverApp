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

export default function App() {
  const queryClient = new QueryClient();
  //const setFcmToken = useSetRecoilState(fcmTokenData);
  // const getToken = async () => {
  //   const token = await messaging().getToken();
  //   setFcmToken(token);
  // }
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //background
    console.log("Message handled in the background!", remoteMessage); //remoteMessage.body , remoteMessage.title
  });
  useEffect(() => {
    //getToken();
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      //foreground
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
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
