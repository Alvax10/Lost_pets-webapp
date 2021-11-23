import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database";

export class User extends Model {}
User.init({
    name: DataTypes.STRING,
    bio: DataTypes.STRING,
    imgDataURL: DataTypes.STRING,
  }, { sequelize, modelName: 'user' }
);
