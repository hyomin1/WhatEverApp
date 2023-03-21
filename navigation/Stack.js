import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../components/Profile";
import Join from "../login/Join";
import Login from "../login/Login";
import Tabs from "./Tabs";
import Main from "../components/Main";

const NativeStack = createNativeStackNavigator();

const Stack = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <NativeStack.Screen
      name="Join"
      component={Join}
      options={{ headerShown: false }}
    />
    <NativeStack.Screen
      name="Tabs"
      component={Tabs}
      options={{ headerShown: false }}
    />
    <NativeStack.Screen name="Profile" component={Profile} />
  </NativeStack.Navigator>
);

export default Stack;
