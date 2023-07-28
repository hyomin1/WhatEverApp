import { View } from "react-native";
import { useRecoilValue } from "recoil";
import { reportData } from "../atom";
import ReportInform from "./ReportInform";

const AdminHistory = () => {
  const reportList = useRecoilValue(reportData);
  console.log(reportList);

  return (
    <View>
      {reportList
        ? reportList.map((data, index) => (
            <ReportInform key={index} data={data} />
          ))
        : null}
    </View>
  );
};

export default AdminHistory;
