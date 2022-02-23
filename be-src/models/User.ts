import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database";

export class User extends Model {}
User.init({
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    mascotId: DataTypes.INTEGER,
  }, { sequelize, modelName: 'user' }
);
