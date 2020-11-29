import { AppState } from './app.state';
import { Action, ActionType } from './app.actions';

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
    case ActionType.SET_TEAM_LIST:
      return { ...state, teamList: action.payload };
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
