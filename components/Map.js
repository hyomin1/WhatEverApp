import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { BASE_URL } from "../api";
import { Image } from "react-native";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { contentData } from "../atom";

const Map = ({ location, distanceHelper }) => {
  const setDistanceHelper = useSetRecoilState(contentData);
  const onRegionChange = (region) => {
    axios
      .put(`${BASE_URL}/api/location/findHelper/distance`, {
        latitude: region.latitude,
        longitude: region.longitude,
      })
      .then((res) => {
        setDistanceHelper(res.data.content);
        console.log("지도 움직일때 마다 요청");
      });
  };
  return (
    <MapView
      onRegionChangeComplete={onRegionChange}
      style={{ width: "100%", flex: 1 }}
      region={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      showsUserLocation={true}
      provider={PROVIDER_GOOGLE}
    >
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
      />
      {distanceHelper
        ? distanceHelper.map((location) => (
            <Marker
              onPress={() =>
                navigate("HelperProfile", {
                  name: location.name,
                  introduce: location.introduce,
                  rating: location.rating,
                  id: location.id,
                  image: location.image,
                })
              }
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            >
              <Image
                source={
                  location.image
                    ? {
                        uri: `data:image/png;base64,${location.image}`,
                      }
                    : require("../images/profile.jpg")
                }
                style={{ height: 35, width: 35, borderRadius: 20 }}
              />
            </Marker>
          ))
        : null}
    </MapView>
  );
};
export default Map;
