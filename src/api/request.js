import axios from "axios";
export const baseURL = "https://www.ebi.ac.uk/pride/ws/archive/v2";
export const resourceURL = "http://hh-rke-wp-webadmin-44-worker-5.caas.ebi.ac.uk:31434";
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
