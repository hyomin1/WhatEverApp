import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import Stack from "./Stack";
import AdminTab from "./AdminTab";
const Nav = createNativeStackNavigator();

const Root = () => (
  <Nav.Navigator screenOptions={{ headerShown: false }}>
    <Nav.Screen name="Stack" component={Stack} />
    <Nav.Screen name="Tabs" component={Tabs} />
    <Nav.Screen name="AdminTab" component={AdminTab} />
  </Nav.Navigator>
);

export default Root;
