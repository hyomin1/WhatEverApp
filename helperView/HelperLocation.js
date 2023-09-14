import { LocationAccuracy } from "expo-location";
import { View, Text, ActivityIndicator, Image } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { hourMoreLocationData } from "../atom";

const HelperLocation = ({ route }) => {
  const [location, setLocation] = useState();
  const [isLoading, setLoading] = useState(true);
  const [ok, setOk] = useState();

  const [locations, setLocations] = useState();
  const [hourMoreLocation, setHourMoreLocation] =
    useRecoilState(hourMoreLocationData);
  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      //setOk("error");
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    setLocation({ latitude, longitude });
    setLoading(false);
  };
  useEffect(() => {
    getLocation();
    setLocations(route.params.location);

    return () => {
      setHourMoreLocation(null);
    };
  }, []);

  const isHour = route.params.isHour;

  return (
    <View style={{ flex: 1 }}>
      {isHour ? (
        location === undefined ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
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
            <Marker
              coordinate={{
                latitude: locations[locations.length - 1].latitude,
                longitude: locations[locations.length - 1].longitude,
              }}
            >
              <Image
                style={{ width: 50, height: 50, borderRadius: 25 }}
                source={require("../images/rider.jpg")}
              />
            </Marker>
            <Polyline coordinates={locations} strokeWidth={6} />
          </MapView>
        )
      ) : hourMoreLocation === null ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      ) : (
        <MapView
          style={{ flex: 1 }}
          region={{
            latitude: hourMoreLocation.latitude,
            longitude: hourMoreLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={{
              latitude: hourMoreLocation.latitude,
              longitude: hourMoreLocation.longitude,
            }}
          >
            <Image
              style={{ width: 50, height: 50, borderRadius: 25 }}
              source={require("../images/rider.jpg")}
            />
          </Marker>
        </MapView>
      )}
    </View>
  );
};

export default HelperLocation;
