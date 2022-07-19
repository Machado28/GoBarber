import { Router } from 'express';
import UserController from './app/controllers/UserController';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  try {
    return res.status(200).json({
      autor: 'António Machado',
      appName: 'GoBarber',
      version: '1.0',
      email: 'ulundoantonio@gmail.com',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
routes.post('/users', UserController.store);

export default routes;
