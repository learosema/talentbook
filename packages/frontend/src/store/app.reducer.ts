import { Identity, User, UserSkill, Skill } from '../api/skill-api';
import { ErrorItem } from '../components/error-list/error-list';

export type AppState = {
  identity: Identity | null | undefined;
  darkMode: boolean;

  userData: User | null;
  myProfileErrors: ErrorItem[];

  userSkills: UserSkill[];
  newSkillForm: NewSkillForm;
  newSkillErrors: ErrorItem[];

  skillList: Skill[];
};

export type NewSkillForm = {
  skillName: string;
  skillLevel: number;
  willLevel: number;
};

export const initialAppState: AppState = {
  identity: undefined,
  darkMode: true,
  userData: null,
  myProfileErrors: [],

  userSkills: [],
  skillList: [],
  newSkillForm: {
    skillName: '',
    skillLevel: 5,
    willLevel: 5,
  },
  newSkillErrors: [],
};

export enum ActionType {
  SET_IDENTITY,
  SET_DARKMODE,
  SET_USERDATA,
  SET_MYPROFILE_ERRORS,
  SET_USER_SKILLS,
  SET_NEWSKILL_FORM,
  SET_NEWSKILL_ERRORS,
  SET_SKILL_LIST,
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

  // My Profile
  setUserData: createAction<User>(ActionType.SET_USERDATA),
  setMyProfileErrors: createAction<ErrorItem[]>(
    ActionType.SET_MYPROFILE_ERRORS
  ),

  // My Skills

  setUserSkills: createAction<UserSkill[]>(ActionType.SET_USER_SKILLS),
  setNewSkillForm: createAction<NewSkillForm>(ActionType.SET_NEWSKILL_FORM),
  setNewSkillErrors: createAction<ErrorItem[]>(ActionType.SET_NEWSKILL_ERRORS),

  // Skill Settings
  setSkillList: createAction<Skill[]>(ActionType.SET_SKILL_LIST),
};

export function appReducer(state: AppState, action: Action<any>): AppState {
  switch (action.type) {
    case ActionType.SET_DARKMODE:
      return { ...state, darkMode: action.payload };
    case ActionType.SET_IDENTITY:
      return { ...state, identity: action.payload };
    case ActionType.SET_USERDATA:
      return { ...state, userData: action.payload };
    case ActionType.SET_MYPROFILE_ERRORS:
      return { ...state, myProfileErrors: action.payload };
    case ActionType.SET_USER_SKILLS:
      return { ...state, userSkills: action.payload };
    case ActionType.SET_NEWSKILL_FORM:
      return { ...state, newSkillForm: action.payload };
    case ActionType.SET_NEWSKILL_ERRORS:
      return { ...state, newSkillErrors: action.payload };
    case ActionType.SET_SKILL_LIST:
      return { ...state, skillList: action.payload };
    default:
      return { ...state };
  }
}
