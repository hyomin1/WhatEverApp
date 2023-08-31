import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminView from "../adminView/AdminView";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();

const AdminTab = ({ navigation: { naviagte } }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="관리자"
        component={AdminView}
        options={{
          tabBarIcon: ({ focus, color }) => {
            return (
              <MaterialCommunityIcons
                name="cog-outline"
                size={24}
                color="black"
              />
            );
          },
          headerTitle: "관리자",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 18,
            color: "black",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: -5,
          },
          tabBarActiveTintColor: "#1e272e",
        }}
      />
    </Tab.Navigator>
  );
};
export default AdminTab;
