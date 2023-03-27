import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../components/Profile";
import Join from "../login/Join";
import Login from "../login/Login";
import Tabs from "./Tabs";
import Main from "../components/Fix";
import Fix from "../components/Fix";

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
    <NativeStack.Screen
      name="Profile"
      component={Profile}
      options={{
        headerTitle: "내 정보",
        headerStyle: {},
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 18,
        },
      }}
    />
    <NativeStack.Screen
      name="Fix"
      component={Fix}
      options={{
        animation: "slide_from_bottom",
        presentation: "transparentModal",
        orientation: "portrait_down",
      }}
    />
  </NativeStack.Navigator>
);

export default Stack;
