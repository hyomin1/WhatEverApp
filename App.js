import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import * as encoding from "text-encoding";
import Root from "./navigation/Root";
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { Alert } from "react-native";

export default function App() {
  const queryClient = new QueryClient();
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //background
    console.log("Message handled in the background!", remoteMessage); //remoteMessage.body , remoteMessage.title
  });
  useEffect(() => {
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
