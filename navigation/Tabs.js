import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Main from "../components/Main";
import History from "../components/History";
import Chat from "../components/Chat";
import Login from "../login/Login";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Tabs = ({ navigation: { navigate }, route }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        // headerShown: false,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: -5,
        },
        tabBarActiveTintColor: "#1e272e",
      }}
    >
      <Tab.Screen
        name="헬퍼보기"
        component={Main}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <AntDesign
                name={focused ? "smile-circle" : "smileo"}
                size={20}
                color={color}
              />
            );
          },
          headerTitle: "심부름 요청",

          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 18,
            color: "black",
          },
          headerLeft: ({ navigation }) => {
            return (
              <Octicons
                name="person"
                style={{ marginLeft: 11 }}
                size={24}
                color="black"
                onPress={() => navigate("Profile")}
              />
            );
          },
          headerRight: () => {
            return (
              <FontAwesome
                name="bell-o"
                style={{ marginRight: 11 }}
                size={24}
                color="black"
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="이용내역"
        component={History}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <MaterialCommunityIcons
                name="history"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="채팅"
        component={Chat}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Ionicons
                name={
                  focused
                    ? "chatbubble-ellipses"
                    : "chatbubble-ellipses-outline"
                }
                size={size}
                color={color}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
