import { Identity } from '../client/skill-api';

export type AppState = {
  identity: Identity | null | undefined;
  darkMode: boolean;
};

export const initialAppState: AppState = {
  identity: undefined,
  darkMode: true,
};
