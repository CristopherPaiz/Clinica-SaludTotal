import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Especialidad extends Model {}

  Especialidad.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: "Especialidad",
      timestamps: false,
    }
  );

  return Especialidad;
};
