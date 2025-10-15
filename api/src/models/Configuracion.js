import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Configuracion extends Model {}

  Configuracion.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre_negocio: { type: DataTypes.STRING, allowNull: false },
      servicios: { type: DataTypes.TEXT },
      horarios: { type: DataTypes.TEXT },
      ubicacion: { type: DataTypes.TEXT },
      mapa_coordenadas: { type: DataTypes.STRING },
      duracion_cita_min: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30 },
      galeria_imagenes: { type: DataTypes.JSONB },
    },
    {
      sequelize,
      modelName: "Configuracion",
      timestamps: false,
    }
  );

  return Configuracion;
};
