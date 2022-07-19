import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: 'user already exists!' });
    }
    const { name, emil, password_hash, provider } = await User.create(req.body);

    return res.status(201).json({ name, emil, password_hash, provider });
  }
}
export default new UserController();
