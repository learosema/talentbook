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


export class SkillApi {
  
  static async getVersion(): Promise<void> {
    const response = await fetch(ENDPOINT + '/version');
    const data = await response.json();
    return data;
  }

}
