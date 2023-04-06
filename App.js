import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import * as encoding from "text-encoding";
import Root from "./navigation/Root";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <RecoilRoot>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </RecoilRoot>
  );
}
