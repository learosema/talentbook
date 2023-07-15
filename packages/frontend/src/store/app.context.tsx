import React, {
  createContext,
  useReducer,
  useMemo,
  useContext,
  Dispatch,
} from 'react';
import { isDarkTheme } from '../helpers/preferences';

import { Action, Actions } from './app.actions';
import { appReducer } from './app.reducer';
import { AppState, initialAppState } from './app.state';
import { Identity, SkillApi } from '../client/skill-api';
import { ApiException } from '../client/ajax';
import { useQuery } from 'react-query';

export type AppContextType = {
  state: AppState;
  dispatch: Dispatch<Action<any>>;
};

const MyAppContext = createContext<AppContextType>({
  state: initialAppState,
  dispatch: () => { },
});

export type AppProviderProps = {
  children?: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialAppState,
    darkMode: isDarkTheme(),
  });
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return (
    <MyAppContext.Provider value={value}>{children}</MyAppContext.Provider>
  );
};

export const useAppStore = () => {
  return useContext(MyAppContext);
};

export const useTheme = () => {
  const { state, dispatch } = useAppStore();
  const themeObj = {
    get theme(): string {
      return state.darkMode ? 'dark' : 'light';
    },
    toggleTheme: () => {
      localStorage.setItem('talentBookTheme', state.darkMode ? 'light' : 'dark');
      dispatch(Actions.setDarkMode(!(state.darkMode)));
    }
  };
  return themeObj;
}

export const useIdentity = () => {
  const loginQuery = useQuery<Identity|null>(['login'], () => {
    return new Promise((resolve, reject) => {
      SkillApi.getLoginStatus().send().then(resolve).catch((ex) => {
        if (ex instanceof ApiException && ex.code === 401) {
          resolve(null);
        } else {
          reject(ex);
        }
      });
    });
  }, {
    staleTime: 10000
  });
  const {data: identity} = loginQuery;
  return identity;
}