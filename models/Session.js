import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/config.js";

export class Session extends Model {}

Session.init(
  {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "Session",
  }
);
