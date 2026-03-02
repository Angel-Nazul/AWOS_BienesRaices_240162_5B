import { DataTypes } from "sequelize";
import db from "../config/db.js"
//import bcrypt from 'bcrypt';
//import crypto from 'crypto';

const Usuario = db.define('Usuario', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type:DataTypes.STRING(100),
        allowNull:false,
        validate:
        {
            notEmpty:{
                msg:'El nombre no puede estar vacia'}
        }
    },
    email:{
        type: DataTypes.STRING(100),
        allowNull:false,
        unique: {
            msg: 'El email ya esta registrado'
        },
        validate:{
            isEmail:{
                msg: 'Debe proporcinar un email valido'
            },
            notEmpty:{
                msg: 'El email no puede estar vacio'
            }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate:{
            notEmpty:{
                msg: 'Lacontraseña no puede estar vacia'
            },
            len: {
                arsg: [8, 100],
                msg: 'La contraseña debe tener almenos 8 caracteres'
            }
        }
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    tokenRecovery: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'token_recovery'
    },
    tokenExpiration: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'token_expiration'
    },
    regStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'reg_status'
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login'
    }
}, {
    tableName: 'tb_users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    hooks: {
        //Has de contraseña antes de crear
        beforeCreate: async (usuario) =>{
            if (usuario.password) {
                const salt = await bccrypt.genSalt(parseInt(process.env.BCCRYPT_ROUNDS) || 10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        },

        //Hash de contraseña antes de actualizar (si cambio)
        beforeUpdate: async (usuario) =>{
            if (usuario.changed('password')) {
                const salt = await bccrypt.genSalt(parseInt(process.env.BCCRYPT_ROUNDS) || 10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
    }
});

export default Usuario;