import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Cita extends Model {
    static associate(models) {
      this.belongsTo(models.Paciente, { foreignKey: "pacienteId", as: "paciente" });
      this.belongsTo(models.Medico, { foreignKey: "medicoId", as: "medico" });
    }
  }

  Cita.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      fecha_hora: { type: DataTypes.DATE, allowNull: false },
      estado: { type: DataTypes.INTEGER, allowNull: false },
      nota: { type: DataTypes.TEXT },
      pacienteId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Pacientes", key: "id" } },
      medicoId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Medicos", key: "id" } },
    },
    {
      sequelize,
      modelName: "Cita",
    }
  );

  return Cita;
};
