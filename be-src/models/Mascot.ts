import { Model, DataTypes } from "sequelize";
import { sequelize } from "./database";

export class Mascot extends Model {}
Mascot.init({
    petName: DataTypes.STRING,
    _geoloc: DataTypes.JSONB,
    imageDataURL: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, { sequelize, modelName: 'mascot' }
);
