import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import Stack from "./Stack";
import Drawer from "./Drawer";
const Nav = createNativeStackNavigator();

const Root = () => (
  <Nav.Navigator screenOptions={{ headerShown: false }}>
    <Nav.Screen name="Stack" component={Stack} />
    <Nav.Screen name="Tabs" component={Tabs} />
    <Nav.Screen name="Drawer" component={Drawer} />
  </Nav.Navigator>
);

export default Root;
