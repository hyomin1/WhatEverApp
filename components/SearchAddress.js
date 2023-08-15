import { Modal } from "react-native";
import Postcode from "@actbase/react-daum-postcode";
import * as Location from "expo-location";

const SearchAddress = () => {
  return (
    <Modal animationType="slide" visible={receiveAddress}>
      <Postcode
        style={{ flex: 1, height: 250, marginBottom: 40 }}
        jsOptions={{ animation: true }}
        onSelected={async (data) => {
          const location = await Location.geocodeAsync(data.query);
          setAddress2(data.address);
          setReceiveLatitude(location[0].latitude);
          setReceiveLongitude(location[0].longitude);
          setReceiveAddress(!receiveAddress);
        }}
      />
    </Modal>
  );
};
export default SearchAddress;
