import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect } from "react";
import { useState } from "react";
import { View } from "react-native";
const WorkMap = ({ route }) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const loc = route.params.work;
  const isDestination = route.params.destination;
  console.log(loc, isDestination);
  useEffect(() => {
    const getLocation = async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        return;
      }
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      setLocation({
        latitude,
        longitude,
      });
    };
    getLocation();
    const watchLocation = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000 },
      (location) => {
        const { latitude, longitude } = location.coords;
        setLocation({
          latitude,
          longitude,
        });
      }
    );
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ width: "100%", flex: 1 }}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: location.latitude || 0,
          longitude: location.longitude || 0,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        }}
      >
        <Marker
          coordinate={{
            latitude: isDestination ? loc.latitude : loc.receiveLatitude,
            longitude: isDestination ? loc.longitude : loc.receiveLongitude,
          }}
        />
      </MapView>
    </View>
  );
};

export default WorkMap;
