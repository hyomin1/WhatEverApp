import { ScrollView } from "react-native";
import { useRecoilValue } from "recoil";
import { adminData } from "../atom";
import UserHistory from "./UserHistory";
import AdminHistory from "./AdminHistory";

const History = () => {
  const isAdmin = useRecoilValue(adminData);

  return (
    <ScrollView
      style={{ backgroundColor: "#dcdde1", flex: 1, paddingHorizontal: 20 }}
    >
      {isAdmin ? <AdminHistory /> : <UserHistory />}
    </ScrollView>
  );
};

export default History;
