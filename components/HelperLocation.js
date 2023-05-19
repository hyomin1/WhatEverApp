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

  const [locations, setLocations] = useState();
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
  console.log(route.params.location);
  useEffect(() => {
    getLocation();
    setLocations(route.params.location);
  }, []);

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
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          provider={PROVIDER_GOOGLE}
        >
          <Polyline coordinates={locations} strokeWidth={8} />
        </MapView>
      )}
    </View>
  );
};

export default HelperLocation;
