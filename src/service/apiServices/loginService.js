import axiosInstance from "../axiosInstance";
import { AUTH_API } from "./endpoints/apiConstants";

export const loginApi = async (obj) => {
  const response = await axiosInstance.post(AUTH_API.LOGIN, obj);

  console.log("response.data:", response.data);
  let loginDetails = {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
    tokenType: response.data.tokenType,
    role: response.data.role,
    userDetails: {
      email: response.data.email,
      userId: response.data.userId,
      name: response.data.name
    }
  }
  return loginDetails;
};
