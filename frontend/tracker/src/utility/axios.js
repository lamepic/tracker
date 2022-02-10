import axios from "axios";

export const auth_axios = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  // baseURL: "http://192.168.40.8:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  // baseURL: "http://192.168.40.8:8000/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
