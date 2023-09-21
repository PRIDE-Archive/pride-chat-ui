import axios from "axios";
import qs from "qs";

export const baseURL = "https://www.ebi.ac.uk/pride/ws/archive/v2";

const server = axios.create({
  baseURL: baseURL,
  headers: { "Access-Control-Allow-Origin": "*" },
  timeout: 120000,
});

export const get = (url, params) => {
  return server.get(url, { params });
};

export const post = (url, data) => {
  return server.post(url, JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
