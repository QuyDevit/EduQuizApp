import {BASE_URL} from '../../api/config';
import {TQuestionSession} from '../types';

export const initialState = {
  avatar: '',
  accessory: '',
  name: '',
  loading: true,
  loadingGame: false,
  isStart: false,
  isClose: false,
  joinGame: false,
  changeAvatar: false,
  connection: null,
  data: null,
  tabEdit: 0,
  background: `${BASE_URL}/src/img/playtheme.png`,
  arrAvatar: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  arrAccessory: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  openmenu: false,
  question: null,
  countquestions: 0,
  countdownStarted: false,
  score: 0,
  statusScoreCurrentQuestion: null, // 0: Không có đáp án , 1: Đúng, 2: Sai
  scoreCurrentQuestion: 0,
  waitingResult: false,
};

export function gameReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'SET_CONNECTED':
      return {...state, connection: action.payload};
    case 'SET_CLOSE':
      return {...state, isClose: action.payload};
    case 'SET_DATA':
      return {...state, data: action.payload};
    case 'SET_AVATAR':
      return {...state, avatar: action.payload};
    case 'SET_ACCESSORY':
      return {...state, accessory: action.payload};
    case 'SET_NAME':
      return {...state, name: action.payload};
    case 'SET_LOADING':
      return {...state, loading: action.payload};
    case 'SET_LOADING_GAME':
      return {...state, loadingGame: action.payload};
    case 'SET_QUESTION':
      return {
        ...state,
        question: action.payload,
        countquestions: state.countquestions + 1,
        statusScoreCurrentQuestion: null,
        scoreCurrentQuestion: 0,
      };
    case 'SET_OPENMENU':
      return {...state, openmenu: action.payload};
    case 'SET_IS_START':
      return {...state, isStart: action.payload};
    case 'SET_JOIN_GAME':
      return {...state, joinGame: action.payload};
    case 'SET_CHANGE_AVATAR':
      return {...state, changeAvatar: action.payload};
    case 'SET_TAB_EDIT':
      return {...state, tabEdit: action.payload};
    case 'SET_BACKGROUND':
      return {...state, background: action.payload};
    case 'SET_COUNTDOWN_STARTED':
      return {...state, countdownStarted: action.payload};
    case 'SET_SCORE':
      return {
        ...state,
        score: state.score + (action.payload || 0),
      };
    case 'SET_SCORE_CURRENTQUESTION':
      return {
        ...state,
        scoreCurrentQuestion: action.payload,
      };
    case 'SET_STATUS_SCORE_CURRENTQUESTION':
      return {
        ...state,
        statusScoreCurrentQuestion: action.payload,
      };
    case 'SET_WAITINGRESULT':
      return {...state, waitingResult: action.payload};
    default:
      return state;
  }
}
