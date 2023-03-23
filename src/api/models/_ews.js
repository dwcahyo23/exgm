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
        qty_order: {
            type: DataTypes.INTEGER,
        },
        wdo_qty: {
            type: DataTypes.INTEGER,
        },
        delay_qty: {
            type: DataTypes.INTEGER,
        },
        fg_qty: {
            type: DataTypes.INTEGER,
        },
        trs_qty: {
            type: DataTypes.INTEGER,
        },
        pk_qty: {
            type: DataTypes.INTEGER,
        },
        wip3_qty: {
            type: DataTypes.INTEGER,
        },
        wip_qty: {
            type: DataTypes.INTEGER,
        },
        asrs_qty: {
            type: DataTypes.INTEGER,
        },
    },
    { freezeTableName: true, timestamps: false }
)
