import {TextProps} from 'react-native';
export interface IMainSlice {
  appColorMode: TAppColorMode;
  sessionGame: TSession;
}
export type TSession = {
  idsession: number;
  pin: string;
};

export interface IText extends TextProps {}
export interface FastImageResProps {
  source: number | {uri: string}; 
}
export type TAppColorMode = 'light' | 'dark';
