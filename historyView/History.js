import { View, ScrollView } from "react-native";

import UserHistory from "./UserHistory";

const History = () => {
  return (
    <ScrollView style={{ backgroundColor: "#f5f5f5" }}>
      <UserHistory />
    </ScrollView>
  );
};

export default History;
