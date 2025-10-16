import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Medico extends Model {
    static associate(models) {
      this.belongsTo(models.Usuario, { foreignKey: "usuarioId", as: "usuario" });
      this.hasMany(models.Cita, { foreignKey: "medicoId", as: "citas" });
      this.hasMany(models.HorarioMedico, { foreignKey: "medicoId", as: "horarios" });
    }
  }

  Medico.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre_completo: { type: DataTypes.STRING, allowNull: false },
      colegiado: { type: DataTypes.STRING, allowNull: false, unique: true },
      especialidad: { type: DataTypes.STRING, allowNull: false },
      telefono: { type: DataTypes.STRING },
      usuarioId: { type: DataTypes.INTEGER, references: { model: "Usuarios", key: "id" } },
    },
    {
      sequelize,
      modelName: "Medico",
    }
  );

  return Medico;
};
