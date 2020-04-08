import {
  Identity,
  User,
  UserSkill,
  Skill,
  ResultListItem,
} from '../api/skill-api';
import { ErrorItem } from '../components/error-list/error-list';

export type NewSkillForm = {
  skillName: string;
  skillLevel: number;
  willLevel: number;
};

export type SkillEditForm = {
  name: string;
  category: string;
  homepage: string;
  description: string;
};

export type SearchState = {
  query: string;
  searchResult: ResultListItem[];
};

export type MyProfileState = {
  userData: User | null;
  errors: ErrorItem[];
};

export type ProfileState = {
  userData: User | null;
  userSkills: UserSkill[] | null;
};

export type MySkillsState = {
  userSkills: UserSkill[];
  newSkillForm: NewSkillForm;
  errors: ErrorItem[];
};

export type SkillDetailsState = {
  filter: string;
  editForm: SkillEditForm;
  editMode: boolean;
  skillIsNew: boolean;
  errors: ErrorItem[] | null;
  searchResult: ResultListItem[] | null;
};

export type AppState = {
  identity: Identity | null | undefined;
  darkMode: boolean;
  skillList: Skill[];

  search: SearchState;
  profile: ProfileState;
  myProfile: MyProfileState;
  mySkills: MySkillsState;

  skillDetails: SkillDetailsState;
};

export const initialAppState: AppState = {
  identity: undefined,
  darkMode: true,
  skillList: [],

  search: {
    query: '',
    searchResult: [],
  },

  myProfile: {
    userData: null,
    errors: [],
  },

  profile: {
    userData: null,
    userSkills: null,
  },

  mySkills: {
    userSkills: [],
    newSkillForm: {
      skillName: '',
      skillLevel: 5,
      willLevel: 5,
    },
    errors: [],
  },

  skillDetails: {
    filter: '',
    editMode: false,
    skillIsNew: false,
    editForm: {
      name: '',
      category: '',
      homepage: '',
      description: '',
    },
    errors: null,
    searchResult: [],
  },
};

export enum ActionType {
  SET_IDENTITY,
  SET_DARKMODE,
  SET_SEARCH_QUERY,
  SET_SEARCH_RESULT,
  SET_USERDATA,
  SET_MYPROFILE_ERRORS,
  SET_USER_SKILLS,
  SET_NEWSKILL_FORM,
  SET_NEWSKILL_ERRORS,
  SET_SKILL_LIST,
  SET_SKILL_FILTER,
  SET_SKILL_EDITFORM,
  SET_SKILL_EDITMODE,
  SET_SKILL_ISNEW,
  SET_SKILL_ERRORS,
  SET_SKILL_SEARCHRESULT,
  SET_PROFILE_USER,
  SET_PROFILE_SKILLS,
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

  // Search
  setSearchQuery: createAction<string>(ActionType.SET_SEARCH_QUERY),
  setSearchResult: createAction<ResultListItem[]>(ActionType.SET_SEARCH_RESULT),

  // Profile View
  setProfileUser: createAction<User | null>(ActionType.SET_PROFILE_USER),
  setProfileSkills: createAction<UserSkill[] | null>(
    ActionType.SET_PROFILE_SKILLS
  ),

  // My Profile
  setUserData: createAction<User>(ActionType.SET_USERDATA),
  setMyProfileErrors: createAction<ErrorItem[]>(
    ActionType.SET_MYPROFILE_ERRORS
  ),

  // My Skills
  setUserSkills: createAction<UserSkill[]>(ActionType.SET_USER_SKILLS),
  setNewSkillForm: createAction<NewSkillForm>(ActionType.SET_NEWSKILL_FORM),
  setNewSkillErrors: createAction<ErrorItem[]>(ActionType.SET_NEWSKILL_ERRORS),

  // Skill Database Settings
  setSkillList: createAction<Skill[]>(ActionType.SET_SKILL_LIST),
  setSkillFilter: createAction<string>(ActionType.SET_SKILL_FILTER),
  setSkillEditForm: createAction<SkillEditForm>(ActionType.SET_SKILL_EDITFORM),
  setSkillEditMode: createAction<boolean>(ActionType.SET_SKILL_EDITMODE),
  setSkillIsNew: createAction<boolean>(ActionType.SET_SKILL_ISNEW),
  setSkillErrors: createAction<ErrorItem[] | null>(ActionType.SET_SKILL_ERRORS),
  setSkillSearchResult: createAction<ResultListItem[] | null>(
    ActionType.SET_SKILL_SEARCHRESULT
  ),
};

export function appReducer(state: AppState, action: Action<any>): AppState {
  switch (action.type) {
    case ActionType.SET_DARKMODE:
      return { ...state, darkMode: action.payload };
    case ActionType.SET_IDENTITY:
      return { ...state, identity: action.payload };
    case ActionType.SET_SEARCH_QUERY:
      return { ...state, search: { ...state.search, query: action.payload } };
    case ActionType.SET_SEARCH_RESULT:
      return {
        ...state,
        search: { ...state.search, searchResult: action.payload },
      };
    case ActionType.SET_SKILL_LIST:
      return { ...state, skillList: action.payload };
    case ActionType.SET_USERDATA:
      return {
        ...state,
        myProfile: { ...state.myProfile, userData: action.payload },
      };
    case ActionType.SET_MYPROFILE_ERRORS:
      return {
        ...state,
        myProfile: { ...state.myProfile, errors: action.payload },
      };
    case ActionType.SET_USER_SKILLS:
      return {
        ...state,
        mySkills: { ...state.mySkills, userSkills: action.payload },
      };
    case ActionType.SET_NEWSKILL_FORM:
      return {
        ...state,
        mySkills: { ...state.mySkills, newSkillForm: action.payload },
      };
    case ActionType.SET_NEWSKILL_ERRORS:
      return {
        ...state,
        mySkills: { ...state.mySkills, errors: action.payload },
      };
    case ActionType.SET_SKILL_FILTER:
      return {
        ...state,
        skillDetails: { ...state.skillDetails, filter: action.payload },
      };
    case ActionType.SET_SKILL_EDITFORM:
      return {
        ...state,
        skillDetails: { ...state.skillDetails, editForm: action.payload },
      };
    case ActionType.SET_SKILL_ERRORS:
      return {
        ...state,
        skillDetails: { ...state.skillDetails, errors: action.payload },
      };
    case ActionType.SET_SKILL_EDITMODE:
      return {
        ...state,
        skillDetails: { ...state.skillDetails, editMode: action.payload },
      };
    case ActionType.SET_SKILL_ISNEW:
      return {
        ...state,
        skillDetails: { ...state.skillDetails, skillIsNew: action.payload },
      };
    case ActionType.SET_SKILL_SEARCHRESULT:
      return {
        ...state,
        skillDetails: { ...state.skillDetails, searchResult: action.payload },
      };
    case ActionType.SET_PROFILE_SKILLS:
      return {
        ...state,
        profile: { ...state.profile, userSkills: action.payload },
      };
    case ActionType.SET_PROFILE_USER:
      return {
        ...state,
        profile: { ...state.profile, userData: action.payload },
      };
    default:
      return { ...state };
  }
}
