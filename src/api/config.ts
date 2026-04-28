import axios from "axios";
import Toast from "react-native-toast-message";

const URL_SERVER = "https://randomuser.me/";
const TIMEOUT = 60000;

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: URL_SERVER,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: TIMEOUT,
  });

  instance.interceptors.response.use(
    (response) => response,
    handleResponseError
  );

  return instance;
};

const handleResponseError = async (error: any) => {
  const statusCode = error.response?.status;

  switch (statusCode) {
    case 500:
      Toast.show({
        type: "error",
        text1: "Error del servidor",
        text2: "Por favor, inténtalo más tarde",
      });
      break;

    case 503:
      Toast.show({
        type: "error",
        text1: "Servicio no disponible",
        text2: "Por favor, inténtalo más tarde",
      });
      break;

    default:
      if (!statusCode) {
        Toast.show({
          type: "error",
          text1: "Sin conexión",
          text2: "Verifica tu conexión a internet",
        });
      }
      break;
  }

  return Promise.reject(error);
};

const _axios = createAxiosInstance();

export const { get, post, put, patch, delete: destroy } = _axios;

export default _axios;
