import axios from "axios";
export const baseURL = "https://www.ebi.ac.uk/pride/ws/archive/v2";
const server = axios.create({
  baseURL: baseURL,
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
