import { DataTypes, Model } from "sequelize";
import { sequelize } from "./database";

export class Mascot extends Model {}
Mascot.init({
  petName: DataTypes.STRING,
  _geoloc: DataTypes.JSON,
  ImageDataURL: DataTypes.STRING,
  userId: DataTypes.INTEGER,
  objectID: DataTypes.STRING,
}, 
{ sequelize, modelName: 'mascot' });