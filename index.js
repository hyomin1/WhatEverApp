import { registerRootComponent } from "expo";
import { RecoilRoot } from "recoil";
import { LogBox } from "react-native";

import App from "./App";
LogBox.ignoreLogs(["new NativeEventEmitter"]);

const AppWithRecoil = () => (
  <RecoilRoot>
    <App />
  </RecoilRoot>
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(AppWithRecoil);
