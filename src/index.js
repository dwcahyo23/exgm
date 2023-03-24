import * as dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import logger from 'morgan'
import routes from './api/routes'
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swager.json')
const cookieParser = require('cookie-parser')

dotenv.config()

const app = express()
app.set('views', path.join(__dirname, '../public/views'))
app.set('view engine', 'pug')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// adding Helmet to enhance your Rest API's security
app.use(helmet.hidePoweredBy())

// enabling CORS for all requests
app.use(
    cors({
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
)

// adding morgan to log HTTP requests
app.use(logger('dev'))

// swager test
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// server route
routes(app)

// listen server
app.listen(process.env.PORT_APP, () =>
    console.log(`Server up & running in ${process.env.PORT_APP}`)
)
