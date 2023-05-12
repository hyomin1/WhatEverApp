import { LocationAccuracy } from "expo-location";
import { View, Text, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useRecoilTransactionObserver_UNSTABLE } from "recoil";
import { useInterval } from "../func";

const HelperLocation = ({ route }) => {
  const [location, setLocation] = useState();
  const [isLoading, setLoading] = useState(true);
  const [ok, setOk] = useState();
  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk("error");
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    setLocation({ latitude, longitude });
    setLoading(false);
  };
  const routeCoordinates = [
    {
      // 이동경로
      latitude: 35.12141,
      longitude: 126.89368,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    {
      latitude: 35.12336,
      longitude: 126.89412,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  ];
  useEffect(() => {
    getLocation();
  }, []);
  /*useInterval(() => {
    console.log("5초마다실행"); //5분마다 한번 실행 , 맨 처음에 5분후에 실행되기 때문에 처음에 data가져와야함
  }, 5000);*/
  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <View>
          <ActivityIndicator />
        </View>
      ) : (
        <MapView
          style={{ flex: 1 }}
          region={{
            latitude: 35.12141, //location.latitude,
            longitude: 126.89368, //</View>location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          provider={PROVIDER_GOOGLE}
        >
          <Polyline coordinates={routeCoordinates} strokeWidth={8} />
        </MapView>
      )}
    </View>
  );
};

export default HelperLocation;
