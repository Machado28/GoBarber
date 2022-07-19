import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.get('/', async (req, res) =>
  res.status(200).json({
    autor: 'António Machado',
    appName: 'GoBarber',
    version: '1.0',
    email: 'ulundoantonio@gmail.com',
  }),
);
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);
routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;
