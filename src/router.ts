import express from 'express';
import { getRepository } from 'typeorm';
import { User } from './entities/user';
import { Skill } from './entities/skill';
import { hash } from './security-helpers';
import cookieParser from 'cookie-parser';
import { getAuthUser } from './auth-helper';
import { UserSkill } from './entities/userSkill';

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

})

router.post('/signup', async (req, res) => {
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
    user.name = req.body.name;
    user.email = req.body.email;
    user.fullName = req.body.fullName || '';
    user.passwordHash = req.body.password;
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
    const userSkillRepo = getRepository(UserSkill);
    const user = await userRepo.findOneOrFail({
      where: [{name: userName}]
    });
    const skills = await userSkillRepo.find({userName});
    res.json({
      name: user.name,
      fullName: user.fullName,
      location: user.location,
      skills
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
router.post('/user/:name', async (req, res) => {
  const userName = req.params.name;
  try {
    const userRepo = getRepository(User);


    
  } catch (ex) {
    res.status(500).json({error: `${ex.name}: ${ex.message}`});
  }
});

router.post('/user/:name/skill', async (req, res) => {
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
