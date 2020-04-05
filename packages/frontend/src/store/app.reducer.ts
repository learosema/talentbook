import { Identity } from '../api/skill-api';

export type AppState = {
  identity: Identity | null | undefined;
  darkMode: boolean;
};

export const initialAppState: AppState = {
  identity: undefined,
  darkMode: true,
};

export enum ActionType {
  SET_IDENTITY,
  SET_DARKMODE,
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
};

export function appReducer(state: AppState, action: Action<any>): AppState {
  switch (action.type) {
    case ActionType.SET_DARKMODE:
      return { ...state, darkMode: action.payload };
    case ActionType.SET_IDENTITY:
      return { ...state, identity: action.payload };
  }
}
