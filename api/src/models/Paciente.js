import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Paciente extends Model {
    static associate(models) {
      this.belongsTo(models.Usuario, { foreignKey: "usuarioId", as: "usuario" });
      this.hasMany(models.Cita, { foreignKey: "pacienteId", as: "citas" });
    }
  }

  Paciente.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre_completo: { type: DataTypes.STRING, allowNull: false },
      dpi: { type: DataTypes.STRING, allowNull: false, unique: true },
      fecha_nacimiento: { type: DataTypes.DATEONLY },
      telefono: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      direccion: { type: DataTypes.STRING },
      usuarioId: { type: DataTypes.INTEGER, references: { model: "Usuarios", key: "id" } },
    },
    {
      sequelize,
      modelName: "Paciente",
    }
  );

  return Paciente;
};
