import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import Appointments from '../app/models/Appointments';
import File from '../app/models/File';
import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User, File, Appointments];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model?.associate && model.associate(this.connection.models),
      );
  }

  mongo() {
    this.mongoConnetion = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      {
        useNewUrlParser: true,
      },
    );
  }
}
export default new Database();
