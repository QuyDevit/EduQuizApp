import {API_URL,API_KEY} from '@env';
import axios from 'axios';
export const BASE_URL = API_URL;
console.log(BASE_URL);
export const API_ENDPOINTS = {
  QUIZ_SESSION_ENDPOINT : `${BASE_URL}/api/QuizSessionApi/GetQuizSessionByUser`,
  FEEDBACK_ENDPOINT : `${BASE_URL}/api/QuizSessionApi/SendFeedback`,
  HOMEDATA_ENDPOINT : `${BASE_URL}/api/HomeApi/GetHomeData`,
  GAMECONECTION : `${BASE_URL}/gameHub`,
};
export const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-App-Api-Key':`${API_KEY}`
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,  
  headers: defaultHeaders,  
});
const apiCall = async (method, url, data = null, headers = {}) => {
  try {
    const config = {
      method: method,
      url: url,
      headers: {
        ...defaultHeaders,  
        ...headers,  
      },
      data: data,  
    };

    const response = await axiosInstance(config);

    return response.data;
  } catch (error) {
    console.error('Gọi Api lỗi:', error);

  }
};
export default apiCall;