import axios from "axios";
import { useRecoilValue } from "recoil";
import { accessData, grantData } from "./atom";

const access = useRecoilValue(accessData);
const grant = useRecoilValue(grantData);
const auth = grant + " " + access;

const BASE_URL = "http://10.0.2.2:8080";
export const axiosGet = (url) => {
  axios.get(`${BASE_URL}${url}`, {
    headers: {
      Authorization: `${grant}` + " " + `${access}`, //헤더에 토큰 실어 보내기
    },
  });
};
export const headerToken =  Authorization: `${grant}` + " " + `${access}` ;
