import { Sequelize } from 'sequelize'
import db from '../config/db'

const { DataTypes } = Sequelize

export const _auser = db.define(
    '_auser',
    {
        id_user: {
            type: DataTypes.TEXT,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        dakses: {
            type: DataTypes.JSON,
        },
    },
    { freezeTableName: true, timestamps: false }
)
