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
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  accessData,
  distanceData,
  grantData,
  IntroduceData,
  nameData,
  pwData,
  ratingData,
  responseData,
  uniqueIdData,
} from "../atom";
import { useSyncExternalStore } from "react";

const Tab = createBottomTabNavigator();

const Tabs = ({ navigation: { navigate } }) => {
  const access = useRecoilValue(accessData);
  const grant = useRecoilValue(grantData);

  const setPw = useSetRecoilState(pwData);
  const setResponse = useSetRecoilState(responseData);
  const setDistance = useSetRecoilState(distanceData);
  const setIntroduce = useSetRecoilState(IntroduceData);
  const setName = useSetRecoilState(nameData);
  const setRating = useSetRecoilState(ratingData);
  const setUniqueId = useSetRecoilState(uniqueIdData);

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
          headerTitle: "심부름 요청",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 18,
            color: "black",
          },
          headerLeft: () => {
            return (
              <Octicons
                name="person"
                style={{ marginLeft: 11 }}
                size={24}
                color="black"
                onPress={() => {
                  navigate("Profile");
                  axios
                    .get("http://10.0.2.2:8080/api/userInfo", {
                      headers: {
                        Authorization: `${grant}` + " " + `${access}`, //헤더에 토큰 실어 보내기
                      },
                    })
                    .then((res) => {
                      console.log("유저 데이터 받아오기 성공", res.data);
                      setPw(res.data.password);
                      setDistance(res.data.distance);
                      setResponse(res.data.avgReactTime);
                      setIntroduce(res.data.introduce);
                      setName(res.data.name);
                      setRating(res.data.rating);
                      setUniqueId(res.data.id);
                    })
                    .catch((error) => console.log("에러", error));
                }}
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
          tabBarIcon: ({ color, size }) => {
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
