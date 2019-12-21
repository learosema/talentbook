import express from 'express';
import { getRepository } from 'typeorm';
import { User } from './entities/user';
import { Skill } from './entities/skill';
import { hash } from './security-helpers';
import cookieParser from 'cookie-parser';
import { getAuthUser, deleteAuthCookie } from './auth-helper';
import { UserSkill } from './entities/userSkill';
import { Identity } from './entities/identity';
import Joi from 'joi';
import { JoinAttribute } from 'typeorm/query-builder/JoinAttribute';

export const router : express.Router = express.Router();
router.use(express.json());
router.use(cookieParser());
// router.use(authMiddleware);

router.get('/version', (req, res) => {
  res.json({"version": "1.0.0"});
});

router.get('/user', async (req, res, next) => {
  const user = await getAuthUser(req); 
  res.json(user);
});

router.get('/login', async (req, res) => {
  const loggedInUser = await getAuthUser(req);
  if (loggedInUser !== null) {
    res.json(loggedInUser);
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
    const user = await userRepo.findOneOrFail({
      name: req.body.name,
      passwordHash: hash(req.body.password)
    });
    res.json({ ok: true });
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


router.use('/signup', (req, res, next) => {

})

router.post('/signup', async (req, res) => {
  const identity = await getAuthUser(req);
  if (identity !== null) {
    res.status(401).json({error: 'Signup process unavailable when already logged in.'});
    return;
  }
  const requiredProperties = ['name', 'email', 'password'];
  requiredProperties.forEach(prop => {
    if (!req.body[prop]) {
      res.status(403).json({error: prop + ' missing'});
      return;
    }
  });
  try {
    const userRepo = getRepository(User);
    const user = new User();
    const userSchema = Joi.object({
      name: Joi.string().min(3).required(),
      fullName: Joi.string().min(2).required(),
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(6).required(),
      location: Joi.string().optional(),
      twitterHandle: Joi.string().optional(),
      githubUser: Joi.string().optional()
    });
    const form = await userSchema.validate(req.body);
    
    user.name = form.name;
    user.fullName = form.fullName;
    user.email = form.email;
    user.passwordHash = hash(form.password);
    user.githubUser = form.githubUser;
    user.location = form.location;
    user.twitterHandle = form.twitterHandle;
    
    const insertResult = await userRepo.insert(user);
    res.json({'message': 'ok', 'id': insertResult.identifiers});
  } catch (ex) {
    console.log(ex);
    res.status(403).json({error: ex.message });
  }
});

// Query the database for specific skills
router.post('/query', (req, res) => {
  const searchTerm = req.body.searchTerm;
  res.json({searchTerm});
});

// Get information about a user
router.get('/user/:name', async (req, res) => {
  const userName = req.params.name;
  try {
    const userRepo = getRepository(User);
    const user = await userRepo.findOneOrFail({
      where: [{name: userName}]
    });
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
    if (identity === null) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    const userName = req.params.name;
    const userRepo = getRepository(User);
    const user = await userRepo.findOneOrFail({
      where: [{name: userName}]
    });
    // TODO: validation
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.fullName) {
      user.fullName = req.body.fullName;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.password) {
      user.passwordHash = hash(req.body.password);
    }
    if (req.body.githubUser) {
      user.githubUser = req.body.githubUser;
    }
    if (req.body.location) {
      user.location = req.body.location;
    }
    if (req.body.twitterHandle) {
      user.twitterHandle = req.body.twitterHandle;
    }
    userRepo.save(user);
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
    const user = await userRepo.findOneOrFail({name: userName});
    const skills = userSkillRepo.find({
      userName
    });
    res.status(200).json(skills);
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});

router.post('/user/:name/skill', async (req, res) => {
  const identity = await getAuthUser(req);
  if (identity === null) {
    res.status(401).json({error: 'Unauthorized'});
    return;
  }
  const userName = req.params.name;
  const skillName = req.body.skillName;
  try {
    const userRepo = getRepository(User);
    const userSkillRepo = getRepository(UserSkill);
    const user = await userRepo.findOneOrFail({name: userName});
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


router.delete('/skill/:name', async (req, res) => {
  const name = req.params.name;
  const user = await getAuthUser(req);
  if (! user) {
    res.status(401).json({error: 'Unauthorized'});
    return;
  }
  try {
    const skillRepo = getRepository(Skill);
    const deleteResult = await skillRepo.delete({ name });
    if (deleteResult.affected === 0) {
      res.status(404).json({error: 'Skill not found'});
    }
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});
