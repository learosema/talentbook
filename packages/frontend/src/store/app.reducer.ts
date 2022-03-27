import { AppState } from './app.state';
import { Action, ActionType } from './app.actions';

export function appReducer(state: AppState, action: Action<any>): AppState {
  switch (action.type) {
    case ActionType.SET_DARKMODE:
      return { ...state, darkMode: action.payload };
    case ActionType.SET_IDENTITY:
      return { ...state, identity: action.payload };
    default:
      return { ...state };
  }
}
