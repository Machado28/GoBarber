import { Router } from 'express';
import multer from 'multer';
import AppointmentController from './app/controllers/AppointmentController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import ScheduleController from './app/controllers/ScheduleController';
import authMiddleware from './app/middleware/auth';
import multerConfig from './config/multer';

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
routes.get('/providers', ProviderController.index);
const upload = multer(multerConfig);
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.post('/file', upload.single('file'), FileController.store);
routes.get('/schedules', ScheduleController.index);
export default routes;
