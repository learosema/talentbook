import {
  Identity,
  ResultListItem,
  User,
  UserSkill,
  Skill,
} from '../api/skill-api';
import { ErrorItem } from '../components/error-list/error-list';
import { NewSkillForm, SkillEditForm } from './app.state';

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
