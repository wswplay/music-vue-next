import axios from "wswplay-ts-rest-axios";
axios.defaults = axios.defaultConf;

const baseURL = "/";
const ERR_CODE = 0;

axios.defaults.url = baseURL;

export function get(url, params) {
  return axios
    .get(url, {
      params,
    })
    .then((res) => {
      const tempData = res.data;
      if (tempData.code === ERR_CODE) {
        return tempData.result;
      }
    })
    .catch((e) => {
      console.log(e);
    });
}
