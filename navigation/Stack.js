import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Join from "../login/Join";
import Login from "../login/Login";

const NativeStack = createNativeStackNavigator();

const Stack = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen name="Login" component={Login} />
    <NativeStack.Screen name="Join" component={Join} />
  </NativeStack.Navigator>
);

export default Stack;
