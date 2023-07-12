import { Entypo } from "@expo/vector-icons";
import Postcode from "@actbase/react-daum-postcode";
import styled from "styled-components/native";
import { Text, Modal, Dimensions, View } from "react-native";
import React, { useState } from "react";
import * as Location from "expo-location";
import Map from "./Map";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SearchContaienr = styled.View`
  position: absolute;
  width: 70%;
  left: 50%;
  top: 2%;
`;
const SearchInput = styled.Pressable`
  height: 40px;
  background-color: white;
  opacity: 0.8;
  border-radius: 20px;
  padding: 0px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SearchBar = () => {
  const [searchAddress, setSearchAddress] = useState(false);
  return (
    <SearchContaienr style={{ marginLeft: -SCREEN_WIDTH / 3 }}>
      {/* 주소 검색이후 이동 + 서버 요청 코드 추가 */}
      <SearchInput onPress={() => setSearchAddress(!searchAddress)}>
        <Text style={{ opacity: 0.6 }}>주소 검색</Text>
        <Entypo name="magnifying-glass" size={22} color="gray" />
      </SearchInput>
      <Modal animationType="slide" visible={searchAddress}>
        <Postcode
          style={{ flex: 1, height: 250, marginBottom: 40 }}
          jsOptions={{ animation: true }}
          onSelected={async (data) => {
            const location = await Location.geocodeAsync(data.query);
            //setSearchLatitude(location[0].latitude);
            //setSearchLongitude(location[0].longitude);
            setSearchAddress(!searchAddress);
            return (
              <View>
                <Text>adfaaaaaaaaaaaaaaaaaaaaaaaaaaaasfdsafdfdsdasfdsaf</Text>
              </View>
            );
          }}
        />
      </Modal>
    </SearchContaienr>
  );
};
export default SearchBar;
