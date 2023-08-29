import { createDrawerNavigator } from "@react-navigation/drawer";
import AlarmView from "../mainView/AlarmView";
import Tabs from "./Tabs";

const DrawerNav = createDrawerNavigator();

const Drawer = () => {
  return (
    <DrawerNav.Navigator>
      <DrawerNav.Screen name="AlarmView" component={AlarmView} />
    </DrawerNav.Navigator>
  );
};
export default Drawer;
