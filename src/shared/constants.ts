import { showMessage } from "react-native-flash-message";
import { BASE_URL } from "../api/config";

export const AVATAR_URLS = (item: string) =>
    `${BASE_URL}/src/img/avatar/avatar${item}.svg`;
  
export const ACCESSORY_URLS = (item: string) =>
    `${BASE_URL}/src/img/accessory/accessory${item}.svg`;
  
export const PLACEHOLDER_AVATAR_URL = `${BASE_URL}/src/img/avatar/placeholder-avatar.svg`;
export const EYES_BLINK_URL = `${BASE_URL}/src/img/eyes-blink.gif`;
export const ICON_MENU = `https://firebasestorage.googleapis.com/v0/b/eduquiz-d2936.appspot.com/o/logo-main.png?alt=media&token=31683bd2-d7a3-4647-bfec-a654ff1ff66e`;
export const BACKGROUND_PODIUM = `https://firebasestorage.googleapis.com/v0/b/eduquiz-d2936.appspot.com/o/background-podium.png?alt=media&token=db3b1f37-db0c-41b5-8f22-27d5886cc35f`;
export const ADS_DATA = [
  { id: '1', image: `${BASE_URL}/src/img/school1.png` },
  { id: '2', image: `${BASE_URL}/src/img/school2.png` },
  { id: '3', image: `${BASE_URL}/src/img/school3.png` },
  { id: '4', image: `${BASE_URL}/src/img/school4.png` },
  { id: '5', image: `${BASE_URL}/src/img/school5.png` },
  { id: '6', image: `${BASE_URL}/src/img/school6.png` },
];

export const ICON_QUESTION = (type: string): string => {
  const ICONS: { [key: string]: string } = {
      quiz: `${BASE_URL}/src/img/logo-quiz.png`,
      true_false: `${BASE_URL}/src/img/logo-true_false.png`,
      input_answer: `${BASE_URL}/src/img/logo-type-quiz.png`,
  };
  return ICONS[type] || `${BASE_URL}/src/img/logo-quiz.png`; 
};
export const TEXT_TYPE_QUESTION = (type: string): string => {
  const TEXTS: { [key: string]: string } = {
      quiz: 'Câu đố',
      true_false: 'Đúng hoặc sai',
      input_answer: 'Nhập đáp án',
  };
  return TEXTS[type] || 'Câu đố'; 
};
export const showCustomMessage = (message: string, type: 'success' | 'danger' | 'info' | 'warning') => {
    showMessage({
      message: message,
      type: type,  
      duration: 2000,
      autoHide: true,
      style: { justifyContent: 'center', alignItems: 'center' },
    });
  };