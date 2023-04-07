import axios from "axios";

const BASE_URL = "http://10.0.2.2:8080";

export const apiClient = axios.create({
  baseURL: BASE_URL,
});
