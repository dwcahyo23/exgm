import * as dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

dotenv.config()

const readonly = new Sequelize(
    process.env.TABLE_DB,
    process.env.USER_DBR,
    process.env.PASSWORD_DBR,
    {
        host: process.env.HOST_DB,
        port: process.env.PORT_DB,
        dialect: 'postgres',
        schema: 'public',
    }
)

export default readonly
