import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from "../components/Main";
import Join from "../login/Join";
import Login from "../login/Login";

const NativeStack = createNativeStackNavigator();

const Stack = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen name="Login" component={Login} />
    <NativeStack.Screen name="Join" component={Join} />
    <NativeStack.Screen name="Main" component={Main} />
  </NativeStack.Navigator>
);

export default Stack;
