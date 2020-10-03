import express from 'express';
import cookieParser from 'cookie-parser';
import { AuthService } from './services/auth-service';
import { SearchService } from './services/search-service';
import { UserService } from './services/user-service';
import { SkillService } from './services/skill-service';
import { TeamService } from './services/team-service';

export const router: express.Router = express.Router();
router.use(cookieParser());
router.use(express.json());

router.get('/version', (_, res) => {
  res.json({ version: '1.0.0' });
});

// Signing up and logging in and out
router.get('/login', AuthService.getLoginStatus);
router.post('/login', AuthService.login);
router.post('/logout', AuthService.logout);
router.post('/signup', AuthService.signup);

router.get('/oauth/github', AuthService.loginViaGithub);

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

// Teams
router.get('/teams', TeamService.getTeams);
router.get('/my-teams', TeamService.getMyTeams);
router.get('/team/:name', TeamService.getTeam);
router.post('/team', TeamService.createTeam);
router.put('/team/:name', TeamService.updateTeam);
router.delete('/team/:name', TeamService.deleteMember);

// Managing team members
router.put('/team/:teamName/:userName', TeamService.updateMember);
router.delete('/team/:teamName/:userName', TeamService.deleteMember);
router.post('/join-team/:teamName', TeamService.joinTeam);
router.post('/accept-invite/:teamName', TeamService.acceptInvite);
router.post('/invite/:teamName/:userName', TeamService.inviteUser);
