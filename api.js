import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { accessData, grantData } from "./atom";

const BASE_URL = "http://10.0.2.2:8080";

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

/*const api = axios.create({
  baseURL: `${BASE_URL}`,
  headers: { Authorization: `${grant}` + " " + `${access}` },
});*/
