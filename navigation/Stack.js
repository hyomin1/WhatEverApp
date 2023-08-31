import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../profile/Profile";
import Join from "../login/Join";
import Login from "../login/Login";
import Tabs from "./Tabs";
import Fix from "../profile/ProfileFix";
import HelperProfile from "../helperView/HelperProfile";
import HelperList from "../helperView/HelperList";
import Chatting from "../chatView/Chatting";
import Chat from "../chatView/Chat";
import HelperLocation from "../helperView/HelperLocation";
import History from "../historyView/History";
import Map from "../mainView/Map";
import DetailReport from "../adminView/DetailReport";
import AdminTab from "./AdminTab";
import AdminUserView from "../adminView/AdminUserView";
import AdminWorkView from "../adminView/AdminWorkView";
import AdminConversationView from "../adminView/AdminConversationView";
import { useRecoilValue } from "recoil";
import { receiverNameData } from "../atom";

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
      <NativeStack.Screen name="Map" component={Map} />
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
      <NativeStack.Screen
        name="HelperLocation"
        component={HelperLocation}
        options={{
          headerTitle: "헬퍼 위치",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 18,
          },
        }}
      />
      <NativeStack.Screen name="StackHistory" component={History} />
      <NativeStack.Screen
        name="AdminTab"
        component={AdminTab}
        options={{
          headerShown: false,
        }}
      />
      <NativeStack.Screen
        name="DetailReport"
        component={DetailReport}
        options={{
          headerTitle: "신고 내역",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 18,
          },
        }}
      />
      <NativeStack.Screen
        name="AdminConversationView"
        component={AdminConversationView}
        options={{
          headerTitle: "대화 내역",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 18,
          },
        }}
      />
      <NativeStack.Screen
        name="AdminWorkView"
        component={AdminWorkView}
        options={{
          headerTitle: "심부름 정보",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 18,
          },
        }}
      />
      <NativeStack.Screen
        name="AdminUserView"
        component={AdminUserView}
        options={{
          headerTitle: "유저 정보",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 18,
          },
        }}
      />
    </NativeStack.Navigator>
  );
};

export default Stack;
