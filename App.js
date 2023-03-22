import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import Root from "./navigation/Root";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
