import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class HorarioMedico extends Model {
    static associate(models) {
      this.belongsTo(models.Medico, { foreignKey: "medicoId", as: "medico" });
    }
  }

  HorarioMedico.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      dia_semana: { type: DataTypes.INTEGER, allowNull: false },
      hora_inicio: { type: DataTypes.TIME, allowNull: false },
      hora_fin: { type: DataTypes.TIME, allowNull: false },
      duracion_min: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30 },
      medicoId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Medicos", key: "id" } },
    },
    {
      sequelize,
      modelName: "HorarioMedico",
      timestamps: false,
    }
  );

  return HorarioMedico;
};
