import { Model, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

export default (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      this.hasOne(models.Paciente, { foreignKey: "usuarioId", as: "paciente" });
      this.hasOne(models.Medico, { foreignKey: "usuarioId", as: "medico" });
    }
  }

  Usuario.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING, allowNull: false },
      rol: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Usuario",
      hooks: {
        beforeCreate: async (usuario) => {
          if (usuario.password_hash) {
            usuario.password_hash = await bcrypt.hash(usuario.password_hash, 10);
          }
        },
      },
    }
  );

  return Usuario;
};
