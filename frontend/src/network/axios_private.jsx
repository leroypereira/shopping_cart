import axios from "axios";
import { currentSession } from "./auth";

const env = await import.meta.env;

axios.defaults.baseURL = `${env.VITE_AWS_GATEWAY_URL}`;
axios.interceptors.request.use(
  async (config) => {
    const user = await currentSession();
    /* Access the current session and get the jwt token. Pass it to the authorization filed in the header.
       Jwt token in the 'Authorization' field will be validated by Cognito authorizer before providing access to api-gateway.
    */
    if (user?.signInUserSession?.idToken?.jwtToken) {
      const token = user.signInUserSession.idToken.jwtToken;
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
        Authorization: token,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const axiosPrivate = axios;

export default axiosPrivate;
