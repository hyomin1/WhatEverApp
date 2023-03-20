import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { View, Dimensions, Image } from "react-native";
import * as Location from "expo-location";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Main = () => {
  const [location, setLocation] = useState();
  const [ok, setOk] = useState();
  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk("error");
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const setGoogle = Location.setGoogleApiKey(
      "AIzaSyCi-vziLZekzgQjSAJIw_xNPpqvAC25UNo"
    );
    const city = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setLocation({ latitude, longitude });
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {location ? (
        <MapView
          style={{ width: "100%", height: SCREEN_HEIGHT / 1.5 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          >
            <Image
              source={require("../images/help.png")}
              style={{ height: 35, width: 35, borderRadius: 20 }}
            />
          </Marker>
          <Marker
            coordinate={{
              latitude: 36.123,
              longitude: 126.8937,
            }}
          ></Marker>
        </MapView>
      ) : null}
    </View>
  );
};

export default Main;
