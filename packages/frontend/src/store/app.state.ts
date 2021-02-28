import {
  ResultListItem,
  User,
  UserSkill,
  Identity,
  Skill,
  Team,
} from '../client/skill-api';
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
  teamList: Team[];

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
  teamList: [],

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
