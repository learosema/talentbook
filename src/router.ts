import express from 'express';
import cookieParser from 'cookie-parser';
import { AuthService } from './services/auth-service';
import { SearchService } from './services/search-service';
import { UserService } from './services/user-service';
import { SkillService } from './services/skill-service';

export const router : express.Router = express.Router();
router.use(cookieParser());
router.use(express.json());

router.get('/version', (req, res) => {
  res.json({"version": "1.0.0"});
});

// Signing up and logging in and out
router.get('/login', AuthService.getLoginStatus);
router.post('/login', AuthService.login);
router.post('/logout', AuthService.logout);
router.post('/signup', AuthService.signup);

// Query the database for specific skills
router.post('/query', SearchService.query);

// Everything about users
router.get('/user/:name', UserService.getUser);
router.put('/user/:name', UserService.updateUser);
router.delete('/user/:name', UserService.deleteUser);
router.get('/user/:name/skills', UserService.getUserSkills);
router.post('/user/:name/skill', UserService.addUserSkill);
router.put('/user/:name/skill/:skillName', UserService.updateUserSkill);
router.delete('/user/:name/skill/:skillName', UserService.deleteUserSkill);

// Adding and removing skills.
router.get('/skills', SkillService.getSkills);
router.post('/skill', SkillService.addSkill);
router.put('/skill/:name', SkillService.updateSkill);
router.delete('/skill/:name', SkillService.deleteSkill);
