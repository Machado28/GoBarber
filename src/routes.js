import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  try {
    const user = await User.create({
      name: 'Antonio Machado',
      email: '@gmail.com',
      password_hash: '1234',
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
export default routes;
