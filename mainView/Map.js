import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { BASE_URL } from "../api";
import { Image } from "react-native";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { contentData, ratingHelperData, responseHelperData } from "../atom";

const Map = ({ location, distanceHelper, navigate, currentLocation }) => {
  const setDistanceHelper = useSetRecoilState(contentData);
  const setRatingHelper = useSetRecoilState(ratingHelperData);
  const setResponseHelper = useSetRecoilState(responseHelperData);
  const onRegionChange = (region) => {
    axios
      .put(`${BASE_URL}/api/location/findHelper/distance`, {
        latitude: region.latitude,
        longitude: region.longitude,
      })
      .then(({ data }) => {
        setDistanceHelper(data);
        const rating = data.concat(); //평점 순 정렬
        rating.sort(function (a, b) {
          return b.rating - a.rating;
        });
        setRatingHelper(rating);

        const response = data.concat(); //응답시간 순 정렬
        response.sort(function (a, b) {
          return a.avgReactTime - b.avgReactTime;
        });
        setResponseHelper(response);
        //console.log("지도 움직일때 마다 요청");
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
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        }}
      ></Marker>
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
