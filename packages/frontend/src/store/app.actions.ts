import { Identity } from '../client/skill-api';

export enum ActionType {
  SET_IDENTITY,
  SET_DARKMODE,
}

export type Action<T> = {
  type: ActionType;
  payload: T;
};

export function createAction<T>(type: ActionType): (payload: T) => Action<T> {
  return (payload: T) => ({ type, payload });
}

export const Actions = {
  setIdentity: createAction<Identity | null | undefined>(
    ActionType.SET_IDENTITY
  ),
  setDarkMode: createAction<boolean>(ActionType.SET_DARKMODE),
};
