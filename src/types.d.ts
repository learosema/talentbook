import { User } from "./entities/user";

declare global {
  namespace express {
    interface Request {
      user: User|null;
    }
  }
}