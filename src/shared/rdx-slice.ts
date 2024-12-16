import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {IMainSlice, TAppColorMode, TSession} from './types';

// Define the initial state using that type
const initialState: IMainSlice = {
  appColorMode: 'light',
  sessionGame: {} as TSession,
};

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setAppColorMode: (state, action: PayloadAction<TAppColorMode>) => {
      state.appColorMode = action.payload;
    },
    setSessionGame: (state, action: PayloadAction<TSession>) => {
      state.sessionGame = action.payload;
    },
  },
});

export const {setAppColorMode, setSessionGame} = mainSlice.actions;

export default mainSlice.reducer;
