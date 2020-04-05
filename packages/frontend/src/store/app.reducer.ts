import { Identity, User } from '../api/skill-api';

export type AppState = {
  identity: Identity | null | undefined;
  darkMode: boolean;
  userData: User | null;
};

export const initialAppState: AppState = {
  identity: undefined,
  darkMode: true,
  userData: null,
};

export enum ActionType {
  SET_IDENTITY,
  SET_DARKMODE,
  SET_USERDATA,
}

export type Action<T> = {
  type: ActionType;
  payload: T;
};

export const Actions = {
  setIdentity: (
    identity: Identity | null | undefined
  ): Action<Identity | null | undefined> => ({
    type: ActionType.SET_IDENTITY,
    payload: identity,
  }),
  setDarkMode: (darkMode: boolean): Action<boolean> => ({
    type: ActionType.SET_DARKMODE,
    payload: darkMode,
  }),
  setUserData: (user: User): Action<User> => ({
    type: ActionType.SET_USERDATA,
    payload: user,
  }),
};

export function appReducer(state: AppState, action: Action<any>): AppState {
  switch (action.type) {
    case ActionType.SET_DARKMODE:
      return { ...state, darkMode: action.payload };
    case ActionType.SET_IDENTITY:
      return { ...state, identity: action.payload };
    case ActionType.SET_USERDATA:
      return { ...state, userData: action.payload };
    default:
      return { ...state };
  }
}
