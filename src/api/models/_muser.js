import { Sequelize } from 'sequelize'
import db from '../config/db.js'

const { DataTypes } = Sequelize

export const _muser = db.define(
    '_muser',
    {
        id_user: {
            type: DataTypes.TEXT,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.TEXT,
        },
        password: {
            type: DataTypes.TEXT,
        },
        token: {
            type: DataTypes.TEXT,
        },
        no_ex: {
            type: DataTypes.TEXT,
        },
        dakses: {
            type: DataTypes.JSON,
        },
    },
    { freezeTableName: true, timestamps: false }
)
