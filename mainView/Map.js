import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { BASE_URL } from "../api";
import { Alert, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { contentData, ratingHelperData, responseHelperData } from "../atom";

const Map = ({ location, distanceHelper, navigate, currentLocation }) => {
  const setDistanceHelper = useSetRecoilState(contentData);
  const setRatingHelper = useSetRecoilState(ratingHelperData);
  const setResponseHelper = useSetRecoilState(responseHelperData);
  const onRegionChange = async (region) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/location/findHelper/distance`,
        {
          latitude: region.latitude,
          longitude: region.longitude,
        }
      );
      setDistanceHelper(res.data);
      const rating = res.data.concat();

      rating.sort(function (a, b) {
        return b.rating - a.rating;
      });
      setRatingHelper(rating);
      const response = res.data.concat(); //응답시간 순 정렬
      response.sort(function (a, b) {
        return a.avgReactTime - b.avgReactTime;
      });
      setResponseHelper(response);
      //  console.log("지도 움직일때 마다 요청");
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };
  const onPressHelper = async (helperData) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/workList/byHelper/${helperData.id}`
      );
      navigate("HelperProfile", {
        name: helperData.name,
        introduce: helperData.introduce,
        rating: helperData.rating,
        id: helperData.id,
        image: helperData.image,
        completedWork: res.data,
      });
    } catch (error) {
      Alert.alert(error.response.data.message);
    }
  };
  return (
    <MapView
      onRegionChangeComplete={onRegionChange}
      style={{ width: "100%", flex: 23 }}
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
            <TouchableOpacity key={location.id}>
              <Marker
                onPress={() => onPressHelper(location)}
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
            </TouchableOpacity>
          ))
        : null}
    </MapView>
  );
};
export default Map;
