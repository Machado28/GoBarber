import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: 'user already exists!' });
    }
    const { name, email, password_hash, provider } = await User.create(
      req.body,
    );

    return res.status(201).json({ name, email, password_hash, provider });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExist = await User.findOne({
        where: { email },
      });

      if (userExist) {
        return res.status(400).json({ error: 'user already exists!' });
      }
    }
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { name, password, provider } = await user.update(req.body);
    return res.status(201).json({ name, email, password, provider });
  }
}
export default new UserController();
