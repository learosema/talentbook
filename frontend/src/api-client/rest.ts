import axios from 'axios';

const ENDPOINT = '/api'

type User = {
  name: string;
  fullName: string;
  email: string;
}

type Registration = {
  name: string;
  fullName?: string;
  email?: string;
  password?: string;
}

type LoginCredentials = {
  name: string;
  password?: string;
}

type Skill = {
  name: string;
  description?: string;
  homepage?: string;
}

type SkillResult = {
  name: string;
  description?: string;
  homepage?: string;
  userList?: User[];
}

export async function getVersion(): Promise<void> {
  const response = await axios.get(ENDPOINT + '/version');
  return response.data;
}

export async function signup({name, fullName, email, password}: Registration): Promise<void> {
  try {
    const response = await axios.post(ENDPOINT + '/signup', {
      name, fullName, email, password
    });
    if (response.data.error) {
      throw Error(response.data.error);
    } 
  } catch (ex) {
    throw Error(ex.message);
  }
}

export async function login({name, password}: LoginCredentials): Promise<void> {
  try {
    const response = await axios.post(ENDPOINT + '/login', {
      name, password
    });
    console.log(response.data);
    if (response.data.error) {
      throw Error(response.data.error);
    }
  } catch (ex) {
    throw Error(ex.message);
  }
}

export async function getLoginStatus(): Promise<User> {
  try {
    const response = await axios.get(ENDPOINT + '/login');
    console.log(response.data);
    if (response.data.error) {
      throw Error(response.data.error);
    }
    return <User>response.data;
  } catch (ex) {
    throw Error(ex.message);
  }
}

export async function deleteCurrentUser(): Promise<void> {
  try {
    const response = await axios.delete(ENDPOINT + '/user');
    console.log(response.data);
    if (response.data.error) {
      throw Error(response.data.error);
    }
  } catch (ex) {
    throw Error(ex.message);
  }
}

/**
 * Get a list of all skills
 */
export async function getSkills(): Promise<Skill[]> {
  try {
    const response = await axios.get(ENDPOINT + '/skills');
    if (response.data.error) {
      throw Error(response.data.error);
    }
    return <Skill[]>response.data;
  } catch (ex) {
    throw Error(ex.message);
  }
}

/**
 * Get a skill (and maybe people who have will/skill in this skill)
 */
export async function getSkill({name}: Skill): Promise<SkillResult> {
  try {
    const response = await axios.get(ENDPOINT + '/skill/' + name);
    if (response.data.error) {
      throw Error(response.data.error);
    }
    return <SkillResult>response.data;
  } catch (ex) {
    throw Error(ex.message);
  }
}


export async function addSkill({name, description, homepage}: Skill): Promise<void> {
  try {
    const response = await axios.post(ENDPOINT + '/skill/', {
      name, description, homepage
    });
    if (response.data.error) {
      throw Error(response.data.error);
    }
  } catch (ex) {
    throw Error(ex.message);
  }
}

export async function updateSkill({name, description, homepage}: Skill, newName?: string): Promise<void> {
  try {
    const response = await axios.put(ENDPOINT + '/skill/' + name, {
      name: newName || name,
      description,
      homepage
    });
    if (response.data.error) {
      throw Error(response.data.error);
    }
  } catch (ex) {
    throw Error(ex.message);
  }
}

export async function deleteSkill({name}: Skill): Promise<void> {
  try {
    const response = await axios.delete(ENDPOINT + '/skill/' + name);
    if (response.data.error) {
      throw Error(response.data.error);
    }
  } catch (ex) {
    throw Error(ex.message);
  }
}

export async function addUserSkill({name, description, homepage}: Skill, newName?: string): Promise<void> {
  try {
    const response = await axios.post(ENDPOINT + '/user/skill/' + name, {
      name: newName || name,
      description,
      homepage
    });
    if (response.data.error) {
      throw Error(response.data.error);
    }
  } catch (ex) {
    throw Error(ex.message);
  }
}

export async function deleteUserSkill({name}: Skill): Promise<void> {
  try {
    const response = await axios.delete(ENDPOINT + '/skill/' + name);
    if (response.data.error) {
      throw Error(response.data.error);
    }
  } catch (ex) {
    throw Error(ex.message);
  }
}
