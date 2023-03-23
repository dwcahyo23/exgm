import * as dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

dotenv.config()

const db = new Sequelize(
    process.env.TABLE_DB,
    process.env.USER_DB,
    process.env.PASSWORD_DB,
    {
        host: process.env.HOST_DB,
        port: process.env.PORT_DB,
        dialect: 'postgres',
        schema: 'public',
    }
)

export default db
