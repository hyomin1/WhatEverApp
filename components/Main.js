import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { View, Dimensions, Image, Alert } from "react-native";
import * as Location from "expo-location";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { MapStyle } from "../MapStyle";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");



const Main = ({ navigation: { navigate } }) => {
  const [location, setLocation] = useState();
  const [ok, setOk] = useState();

  const aroundUser = [
    { id: 1, latitude: 35.1230467, longitude: 126.8935155 },
    { id: 2, latitude: 35.118835, longitude: 126.8936783 },
  ];
  const onBellPress = () => {
    Alert.alert("알람클릭");
  };

  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk("error");
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    /*const setGoogle = Location.setGoogleApiKey(
      "AIzaSyCi-vziLZekzgQjSAJIw_xNPpqvAC25UNo"
    );*/
    setLocation({ latitude, longitude });
  };

  useEffect(() => {
    getLocation();
  }, []);
  console.log(location);
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
          showsUserLocation={true}
          provider={PROVIDER_GOOGLE}
          customMapStyle={MapStyle}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
          {aroundUser.map((location) => (
            <Marker
              key={location.id}
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
          ))}
        </MapView>
      ) : null}
    </View>
  );
};

export default Main;
