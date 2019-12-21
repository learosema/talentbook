import express from 'express';
import cookieParser from 'cookie-parser';
import Joi from '@hapi/joi';
import { getRepository, Like } from 'typeorm';

import { User } from './entities/user';
import { Skill } from './entities/skill';
import { hash } from './security-helpers';
import { UserSkill } from './entities/userSkill';
import { Identity } from './entities/identity';
import { getAuthUser, deleteAuthCookie, setAuthCookie } from './auth-helper';

export const router : express.Router = express.Router();
router.use(express.json());
router.use(cookieParser());

router.get('/version', (req, res) => {
  res.json({"version": "1.0.0"});
});


router.get('/login', async (req, res) => {
  const identity : Identity|null = await getAuthUser(req);
  if (identity !== null) {
    res.json(identity);
    return;
  }
  res.status(401).json({error: 'Unauthorized'});
});

router.post('/login', async (req, res) => {
  const loggedInUser = await getAuthUser(req);
  if (loggedInUser !== null) {
    res.json(loggedInUser);
    return;
  }
  const requiredProperties = ['name', 'password'];
  requiredProperties.forEach(prop => {
    if (!req.body[prop]) {
      res.status(403).json({error: prop + ' missing'});
      return;
    }
  });
  try {
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({
      name: req.body.name,
      passwordHash: hash(req.body.password)
    });
    if (!user || !user.name || !user.fullName) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    setAuthCookie(res, user.name, user.fullName);
    res.json({message: 'ok', name: user.name, fullName: user.fullName});
  } catch (ex) {
    res.status(401).json({error: ex.message});
  }
});

router.get('/logout', async (req, res) => {
  const identity = await getAuthUser(req);
  if (identity !== null) {
    deleteAuthCookie(res);
    res.status(200).json({message: 'ok'});
    return;
  }
  res.status(401).json({error: 'Unauthorized'});
});

router.post('/signup', async (req, res) => {
  const identity = await getAuthUser(req);
  if (identity !== null) {
    res.status(401).json({error: 'Signup process unavailable when already logged in.'});
    return;
  }
  try {
    const userRepo = getRepository(User);
    const user = new User();
    const userSchema = Joi.object({
      name: Joi.string().min(3).lowercase().required(),
      fullName: Joi.string().min(2).required(),
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(6).required(),
      location: Joi.string().optional(),
      twitterHandle: Joi.string().optional(),
      githubUser: Joi.string().optional()
    });
    const form = await userSchema.validate(req.body);
    // check if user.name already exists
    const userCount = await userRepo.count({name: Like(form.value.name)});
    if (userCount > 0) {
      res.status(403).json({error: 'User already exists.'});
      return;
    }
    user.name = form.value.name.toLowerCase();
    user.fullName = form.value.fullName;
    user.email = form.value.email;
    user.passwordHash = hash(form.value.password);
    user.githubUser = form.value.githubUser;
    user.location = form.value.location;
    user.twitterHandle = form.value.twitterHandle;
    const insertResult = await userRepo.insert(user);
    res.json({'message': 'ok'});
  } catch (ex) {
    console.log(ex);
    res.status(403).json({error: ex.message });
  }
});

// Query the database for specific skills
router.post('/query', async (req, res) => {
  const searchTerm = req.body.searchTerm;
  if (!searchTerm || searchTerm.length === 0) {
    res.status(400).json({error: 'Bad request'});
    return;
  }
  try {
    const userSkillRepo = getRepository(UserSkill);
    const userSkills = await userSkillRepo.find({
      where: [
        {skillName: Like(searchTerm)}
      ]
    });
    res.status(200).json(userSkills);
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
  res.json({searchTerm});
});

// Get information about a user
router.get('/user/:name', async (req, res) => {
  const userName = req.params.name;
  try {
    const userRepo = getRepository(User);
    const user = await userRepo.findOneOrFail({name: userName});
    res.json({
      name: user.name,
      fullName: user.fullName,
      location: user.location,
      githubUser: user.githubUser,
      twitterHandle: user.twitterHandle
    });
  } catch(ex) {
    console.log(ex.name);
    if (ex.name === 'EntityNotFound') {
      res.status(404).json({error: 'User not found'});
      return;
    }
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});

// Update user information.
router.put('/user/:name', async (req, res) => {
  try {
    const identity = await getAuthUser(req);
    const userName = req.params.name;
    if (identity === null || identity.name !== userName) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({
      where: [{name: userName}]
    });
    if (!user) {
      res.status(404).json({error: 'Not found'})
      return;
    }
    const userSchema = Joi.object({
      name: Joi.string().min(3).lowercase().optional(),
      fullName: Joi.string().min(2).optional(),
      email: Joi.string().email().min(6).optional(),
      password: Joi.string().min(6).optional(),
      location: Joi.string().optional(),
      twitterHandle: Joi.string().optional(),
      githubUser: Joi.string().optional()
    });
    const form = await userSchema.validate(req.body);
    // TODO: what does userSchema.validate throw?
    if (form.value.name) {
      user.name = form.value.name;
    }
    if (form.value.fullName) {
      user.fullName = form.value.fullName;
    }
    if (form.value.email) {
      user.email = form.value.email;
    }
    if (form.value.githubUser) {
      user.githubUser = form.value.githubUser;
    }
    if (form.value.location) {
      user.location = form.value.location;
    }
    if (form.value.twitterHandle) {
      user.twitterHandle = form.value.twitterHandle;
    }

    if (req.body.password) {
      user.passwordHash = hash(form.value.password);
    }
    userRepo.save(user);
    setAuthCookie(res, user.name || '', user.fullName || '');
    res.status(200).json({message: 'ok'});
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});

router.delete('/user/:name', async (req, res) => {
  try {
    const identity = await getAuthUser(req);
    if (identity === null || identity.name !== req.params.name) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    const userRepo = getRepository(User);
    const deleteResult = await userRepo.delete({name: req.params.name});
    deleteAuthCookie(res);
    res.status(200).json({message: 'ok'});
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});

router.get('/user/:name/skills', async (req, res) => {
  const userName = req.params.name;
  try {
    const userRepo = getRepository(User);
    const userSkillRepo = getRepository(UserSkill);
    const user = await userRepo.findOne({name: userName});
    if (!user) {
      res.status(404).json({error: 'Not found'});
      return;
    }
    const skills = userSkillRepo.find({
      userName
    });
    res.status(200).json(skills);
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});

router.post('/user/:name/skill', async (req, res) => {
  const userName = req.params.name;
  const skillName = req.body.skillName;
  const identity = await getAuthUser(req);
  if (identity === null || userName !== identity.name) {
    res.status(401).json({error: 'Unauthorized'});
    return;
  }
  try {
    const userRepo = getRepository(User);
    const userSkillRepo = getRepository(UserSkill);
    const user = await userRepo.findOne({name: userName});
    if (!user) {
      res.status(404).json({error: 'Not found'});
      return;
    }
    const existingSkill = await userSkillRepo.findOne({
      userName, skillName
    });
    if (existingSkill) {
      existingSkill.skillLevel = req.body.skillLevel;
      existingSkill.willLevel = req.body.willLevel;
      userSkillRepo.save(existingSkill);
    } else {
      const newSkill = new UserSkill();
      newSkill.userName = userName;
      newSkill.skillName = skillName;
      newSkill.skillLevel = req.body.skillLevel;
      newSkill.willLevel = req.body.willLevel;
      userSkillRepo.save(newSkill);
    }
    res.status(200).json({message: 'ok'});
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});

router.put('/user/{name}/skill/{skillName}', async (req, res) => {
  const userName = req.params.name;
  const skillName = req.body.skillName;
  const identity = await getAuthUser(req);
  if (identity === null || userName !== identity.name) {
    res.status(401).json({error: 'Unauthorized'});
    return;
  }
  try {
    const userSkillRepo = getRepository(UserSkill);
    const skill = await userSkillRepo.findOne({
      userName, skillName
    });
    if (! skill) {
      res.status(404).json({error: 'Skill not found'});
      return;
    }
    const skillScheme = Joi.object({
      skillLevel: Joi.number().required(),
      willLevel: Joi.number().required()
    });
    const form = await skillScheme.validate(req.body);
    skill.skillLevel = form.value.skillLevel;
    skill.willLevel = form.value.willLevel;
    userSkillRepo.save(skill);
    res.status(200).json({message: 'ok'});
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});

router.delete('/user/{name}/skill/{skillName}', async (req, res) => {
  const userName = req.params.name;
  const skillName = req.body.skillName;
  const identity = await getAuthUser(req);
  if (identity === null || userName !== identity.name) {
    res.status(401).json({error: 'Unauthorized'});
    return;
  }
  try {
    const userSkillRepo = getRepository(UserSkill);
    const deleteResult = await userSkillRepo.delete({
      userName, skillName
    });
    if (deleteResult.affected === 0) {
      res.status(404).json({message: 'Not found'});
      return;  
    }
    res.status(200).json({message: 'ok'});
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});

router.get('/skills', async (req, res) => {
  try {
    const skillRepo = getRepository(Skill);
    const skills: Skill[] = await skillRepo.find();
    res.json(skills.map(({name, homepage, description}) => ({name, homepage, description})));
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});

router.post('/skill', async (req, res) => {
  const user = await getAuthUser(req);
  if (! user) {
    res.status(401).json({error: 'Unauthorized'});
    return;
  }
  try {
    const skillRepo = getRepository(Skill);
    const skill = new Skill();
    skill.name = req.body.name;
    skill.homepage = req.body.homepage;
    skill.description = req.body.description;
    skillRepo.save(skill);
    res.json({ ok: true });
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});

router.put('/skill/:name', async (req, res) => {
  const skillName = req.params.name;
  const identity = await getAuthUser(req);
  if (! identity) {
    res.status(401).json({error: 'Unauthorized'});
    return;
  }
  try {
    const skillRepo = getRepository(Skill);
    const skill = await skillRepo.findOne({name: skillName});
    if (! skill) {
      res.status(404).json({error: 'Skill not found'});
      return;
    }
    const skillScheme = Joi.object({
      name: Joi.string().min(3).lowercase().optional(),
      homepage: Joi.string().min(3).lowercase().optional(),
      description: Joi.string().optional()
    });
    const form = await skillScheme.validate(req.body);
    if (form.value.name) {
      skill.name = form.value.name;
    }
    if (form.value.homepage) {
      skill.homepage = form.value.homepage;
    }
    if (form.value.description) {
      skill.description = form.value.description;
    }
    skillRepo.save(skill);
    res.status(200).json({message: 'ok'});
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});


router.delete('/skill/:name', async (req, res) => {
  const skillName = req.params.name;
  const identity = await getAuthUser(req);
  if (! identity) {
    res.status(401).json({error: 'Unauthorized'});
    return;
  }
  try {
    const skillRepo = getRepository(Skill);
    const deleteResult = await skillRepo.delete({ name: skillName });
    if (deleteResult.affected === 0) {
      res.status(404).json({error: 'Skill not found'});
    }
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});
