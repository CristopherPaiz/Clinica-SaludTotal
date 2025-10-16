import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Servicio extends Model {}

  Servicio.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: DataTypes.STRING, allowNull: false },
      descripcion: { type: DataTypes.TEXT, allowNull: false },
      icono: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "Servicio",
      timestamps: false,
    }
  );

  return Servicio;
};
