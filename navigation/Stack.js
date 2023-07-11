import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../components/Profile";
import Join from "../login/Join";
import Login from "../login/Login";
import Tabs from "./Tabs";
import Fix from "../components/Fix";
import HelperProfile from "../components/HelperProfile";
import HelperList from "../components/HelperList";
import Chatting from "../components/Chatting";
import Chat from "../components/Chat";
import { Ionicons } from "@expo/vector-icons";
import { useRecoilValue } from "recoil";
import { receiverNameData } from "../atom";
import HelperLocation from "../components/HelperLocation";
import History from "../components/History";
import AdminLogin from "../login/AdminLogin";
import AdminView from "../components/AdminView";

const NativeStack = createNativeStackNavigator();

const Stack = ({ navigation }) => {
  const receiverName = useRecoilValue(receiverNameData);
  return (
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
      <NativeStack.Screen
        name="HelperList"
        component={HelperList}
        options={{
          headerTitle: "주변 헬퍼 보기",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 18,
          },
        }}
      />
      <NativeStack.Screen
        name="HelperProfile"
        component={HelperProfile}
        options={{
          headerTitle: "헬퍼 정보",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 18,
          },
        }}
      />
      <NativeStack.Screen name="Chat" component={Chat} />
      <NativeStack.Screen
        name="Chatting"
        component={Chatting}
        options={{
          headerTitle: receiverName,
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 18,
          },
        }}
      />
      <NativeStack.Screen name="HelperLocation" component={HelperLocation} />
      <NativeStack.Screen name="StackHistory" component={History} />
      <NativeStack.Screen name="AdminLogin" component={AdminLogin} />
      <NativeStack.Screen name="AdminView" component={AdminView} />
    </NativeStack.Navigator>
  );
};

export default Stack;
