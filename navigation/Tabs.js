import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Main from "../mainView/Main";
import History from "../historyView/History";
import Chat from "../chatView/Chat";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  adminData,
  distanceData,
  historyWorkData,
  IntroduceData,
  myImgData,
  nameData,
  pwData,
  ratingData,
  reportData,
  responseData,
  uniqueIdData,
  userData,
} from "../atom";
import { BASE_URL } from "../api";
import { TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator();

const Tabs = ({ navigation: { navigate } }) => {
  const setPw = useSetRecoilState(pwData); //내 프로필 비밀번호 데이터
  const setResponse = useSetRecoilState(responseData); //내 프로필 응답시간 데이터
  const setDistance = useSetRecoilState(distanceData);
  const setIntroduce = useSetRecoilState(IntroduceData); //내 프로필 자기소개 데이터
  const setName = useSetRecoilState(nameData); //내 프로필 닉네임 데이터
  const setRating = useSetRecoilState(ratingData); //내 프로필 평점 데이터
  const setUniqueId = useSetRecoilState(uniqueIdData);
  const setMyImg = useSetRecoilState(myImgData); //내 프로필 사진 데이터
  const setReportList = useSetRecoilState(reportData);
  const setUser = useSetRecoilState(userData);

  const [historyWork, setHistoryWork] = useRecoilState(historyWorkData);

  const isAdmin = useRecoilValue(adminData);

  return (
    <Tab.Navigator
      screenOptions={{
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
          tabBarIcon: ({ focused, color }) => {
            return (
              <AntDesign
                name={focused ? "smile-circle" : "smileo"}
                size={20}
                color={color}
              />
            );
          },
          headerTitle: "헬퍼 보기",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 18,
            color: "black",
          },
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  //관리자인지 서버에 물어보기 (여기에 추가)

                  axios
                    .get("http://10.0.2.2:8080/api/userInfo")
                    .then((res) => {
                      setUser(res.data);
                      setPw(res.data.password);
                      setDistance(res.data.distance);
                      setResponse(res.data.avgReactTime);
                      setIntroduce(res.data.introduce);
                      setName(res.data.name);
                      setRating(res.data.rating);
                      setUniqueId(res.data.id);
                      setMyImg(res.data.image);
                      navigate("Profile");
                    })
                    .catch((error) => console.log("f", error));
                }}
              >
                <Octicons
                  name="person"
                  style={{ marginLeft: 11 }}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            );
          },
          headerRight: () => {
            return (
              <TouchableOpacity>
                <FontAwesome
                  name="bell-o"
                  style={{ marginRight: 11 }}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen
        name={isAdmin ? "신고내역" : "이용내역"}
        component={History}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            isAdmin
              ? axios
                  .get(`${BASE_URL}/admin/reportList`)
                  .then(({ data }) => {
                    setReportList(data);
                    console.log(data);
                  })
                  .catch((error) => console.log("이용내역admin", error))
              : axios
                  .get(`${BASE_URL}/api/workList/all`)
                  .then(({ data }) => {
                    setHistoryWork(data);
                    console.log(data);
                  })
                  .catch((error) => console.log("유저 이용내역에러", error));
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <MaterialCommunityIcons
                name="history"
                size={size}
                color={color}
              />
            );
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "800",
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
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "800",
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
