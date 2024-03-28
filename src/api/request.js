import axios from "axios";
export const baseURL = "https://www.ebi.ac.uk/pride/ws/archive/v2";
export const resourceURL = "http://codon-gpu-016.ebi.ac.uk:6008";
const server = axios.create({
  baseURL: baseURL,
  timeout: 120000,
});

export const get = (url, params, config = {}) => {
  return server.get(url, { params, ...config });
};
export const post = (url, data, config = {}) => {
  return server.post(url, JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }, ...config
  });
};
