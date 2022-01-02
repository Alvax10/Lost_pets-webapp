import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database";

export class Mascot extends Model {}
Mascot.init({
    name: DataTypes.STRING,
    _geoloc: DataTypes.JSON,
    imageDataURL: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, { sequelize, modelName: 'mascot' }
);
