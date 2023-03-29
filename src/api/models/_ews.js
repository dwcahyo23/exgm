import { Sequelize } from 'sequelize'
import readonly from '../config/readonly.js'

const { DataTypes } = Sequelize

export const _ews = readonly.define(
    '_ews',
    {
        cst_no: {
            type: DataTypes.TEXT,
            primaryKey: true,
        },
        part_no: {
            type: DataTypes.TEXT,
            primaryKey: true,
        },
        fg_qty: {
            type: DataTypes.INTEGER,
        },
        wip_qty: {
            type: DataTypes.INTEGER,
        },
    },
    { freezeTableName: true, timestamps: false }
)
