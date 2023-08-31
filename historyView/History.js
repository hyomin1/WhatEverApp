import { ScrollView } from "react-native";

import UserHistory from "./UserHistory";

const History = () => {
  return (
    <ScrollView style={{ backgroundColor: "#dcdde1", flex: 1 }}>
      <UserHistory />
    </ScrollView>
  );
};

export default History;
