import express from 'express';
import { getRepository } from 'typeorm';
import { User } from './entities/user';
import { Skill } from './entities/skill';
import { hash } from './security-helpers';
import cookieParser from 'cookie-parser';
import { getUser } from './auth-helper';

export const router : express.Router = express.Router();
router.use(express.json());
router.use(cookieParser());
// router.use(authMiddleware);

router.get('/', (req, res) => {
  res.json({"version": "1.0.0"});
});

router.get('/user', async (req, res, next) => {
  const user = await getUser(req); 
  res.json(user);
});

router.post('/login', async (req, res) => {
  const loggedInUser = await getUser(req);
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
    const user = await userRepo.findOneOrFail({where: [{
      name: req.body.name,
      passwordHash: hash(req.body.password)
    }]});
    res.json({ ok: true });
  } catch (ex) {
    res.status(401).json({error: ex.message});
  }
});

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
    await userRepo.insert(user);
    res.json({'message': 'ok'});
  } catch (ex) {
    console.log(ex);
    res.status(403).json({error: ex.message })
  }
});

// Query the database for specific skills
router.post('/query', (req, res) => {
  const searchTerm = req.body.searchTerm;
  res.json({searchTerm});
});

// Get information about a user
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const userRepo = getRepository(User);
    const user = await userRepo.findOneOrFail({where: [{
      name: userId
    }]});
    res.json({ name: user.name, fullName: user.fullName });
  } catch (ex) {
    if (ex.name === 'EntityNotFound') {
      res.status(404).json({error: 'User not found'})
      return;
    }
    res.status(401).json({error: ex.message});
  }
});

router.get('/skills', async (req, res) => {
  try {
    const skillRepo = getRepository(Skill);
    const skills: Skill[] = await skillRepo.find();
    res.json(skills.map(({name, homepage, description}) => ({name, homepage, description})));
  } catch (ex) {
    res.status(500).json({error: ex.message});
  }
});

router.post('/skill', async (req, res) => {

});
