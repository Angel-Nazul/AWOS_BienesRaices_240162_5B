import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const Usuario = db.define('Usuario', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true 
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    token: {
        type: DataTypes.STRING
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    intentos: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bloqueado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'tb_users',
    timestamps: false,
    hooks: {
        beforeSave: async (usuario) => {
            if (usuario.changed('password') && usuario.password) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
    },
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude: ['password', 'token', 'confirmed', 'intentos', 'bloqueado']
            }
        }
    }
});

Usuario.prototype.verificarPassword = function(password) {
    if (!this.password) return false;
    return bcrypt.compareSync(password, this.password);
};

export default Usuario;