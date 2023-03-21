import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from "../components/Main";
import Join from "../login/Join";
import Login from "../login/Login";
import Tabs from "./Tabs";

const NativeStack = createNativeStackNavigator();

const Stack = () => (
  <NativeStack.Navigator screenOptions={{ headerShown: false }}>
    <NativeStack.Screen name="Login" component={Login} />
    <NativeStack.Screen name="Join" component={Join} />
    <NativeStack.Screen name="Main" component={Tabs} />
  </NativeStack.Navigator>
);

export default Stack;
