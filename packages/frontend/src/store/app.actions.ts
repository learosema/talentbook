export enum ActionType {
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
  setDarkMode: createAction<boolean>(ActionType.SET_DARKMODE),
};
