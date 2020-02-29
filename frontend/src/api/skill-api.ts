import { Ajax } from './ajax';

const ENDPOINT = '/api';
const uri = encodeURIComponent;

const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

type Credentials = {
  name: string;
  password: string;
};

export type Identity = {
  name: string;
  fullName: string;
  iat?: string;
  exp?: string;
};

export type User = {
  name: string;
  fullName: string;
  description: string;
  location: string;
  password: string;
  email: string;
  githubUser: string;
  twitterHandle: string;
  pronouns: string;
  role: string;
};

export type UserSkill = {
  userName?: string;
  skillName: string;
  skillLevel: number;
  willLevel: number;
};

export type Skill = {
  name: string;
  homepage: string;
  description: string;
};

export class SkillApi {
  static getVersion(): Ajax {
    return new Ajax(ENDPOINT + '/version', { credentials: 'include' });
  }

  static get404(): Ajax {
    return new Ajax('/error/404');
  }

  static getLoginStatus(): Ajax<Identity> {
    return new Ajax(ENDPOINT + '/login', { credentials: 'include' });
  }

  static login(credentials: Credentials): Ajax {
    return new Ajax(ENDPOINT + '/login', {
      method: 'POST',
      credentials: 'include',
      headers: HEADERS,
      body: JSON.stringify(credentials)
    });
  }

  static signup(newUser: User): Ajax {
    return new Ajax(ENDPOINT + '/signup', {
      method: 'POST',
      credentials: 'include',
      headers: HEADERS,
      body: JSON.stringify(newUser)
    });
  }

  static logout(): Ajax {
    return new Ajax(ENDPOINT + '/logout', {
      method: 'POST',
      credentials: 'include'
    });
  }

  static getUser(name: string): Ajax<User> {
    return new Ajax(ENDPOINT + '/user/' + uri(name), {
      credentials: 'include'
    });
  }

  static updateUser(name: string, user: User): Ajax {
    return new Ajax(ENDPOINT + '/user/' + uri(name), {
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS,
      body: JSON.stringify(user)
    });
  }

  static deleteUser(name: string): Ajax {
    return new Ajax(ENDPOINT + '/user/' + uri(name), {
      method: 'DELETE',
      credentials: 'include',
      headers: HEADERS
    });
  }

  static getUserSkills(name: string): Ajax<UserSkill[]> {
    return new Ajax<UserSkill[]>(ENDPOINT + '/user/' + uri(name) + '/skills', {
      credentials: 'include'
    });
  }

  static addUserSkill(userName: string, userSkill: object): Ajax {
    const uri = encodeURIComponent;
    return new Ajax(ENDPOINT + `/user/${uri(userName)}/skill`, {
      method: 'POST',
      credentials: 'include',
      headers: HEADERS,
      body: JSON.stringify(userSkill)
    });
  }

  static updateUserSkill(
    userName: string,
    skillName: string,
    { skillLevel, willLevel }: UserSkill
  ): Ajax {
    return new Ajax(
      ENDPOINT + `/user/${uri(userName)}/skill/${uri(skillName)}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: HEADERS,
        body: JSON.stringify({ skillLevel, willLevel })
      }
    );
  }

  static deleteUserSkill(userName: string, skillName: string): Ajax {
    return new Ajax(
      ENDPOINT + `/user/${uri(userName)}/skill/${uri(skillName)}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: HEADERS
      }
    );
  }

  static getSkills(): Ajax<Skill[]> {
    return new Ajax(ENDPOINT + '/skills', {
      credentials: 'include'
    });
  }

  static addSkill(skill: Skill): Ajax {
    return new Ajax(ENDPOINT + '/skill', {
      method: 'POST',
      credentials: 'include',
      headers: HEADERS,
      body: JSON.stringify(skill)
    });
  }

  static updateSkill(skillName: string, skill: Skill): Ajax {
    return new Ajax(ENDPOINT + `/skill/${uri(skillName)}`, {
      method: 'PUT',
      credentials: 'include',
      headers: HEADERS,
      body: JSON.stringify(skill)
    });
  }

  static deleteSkill(skillName: string): Ajax {
    return new Ajax(ENDPOINT + `/skill/${uri(skillName)}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: HEADERS
    });
  }

  static query(searchTerm: string): Ajax<UserSkill[]> {
    return new Ajax(ENDPOINT + '/query', {
      method: 'POST',
      credentials: 'include',
      headers: HEADERS,
      body: JSON.stringify({ searchTerm })
    });
  }
}
