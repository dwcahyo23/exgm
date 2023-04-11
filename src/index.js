import * as dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import morgan from 'morgan'
import routes from './api/routes'
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swager.json')
const cookieParser = require('cookie-parser')
const https = require('https')

dotenv.config({ path: path.join(__dirname, '../.env') })

const app = express()
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// adding Helmet to enhance your Rest API's security
app.use(helmet.hidePoweredBy())

// log only 4xx and 5xx responses to console
app.use(morgan('common', {}))

// log all requests to access.log
app.use(
    morgan('common', {
        stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
            flags: 'a',
        }),
    })
)

// enabling CORS for all requests
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
)

// swager test
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// server route
routes(app)

// listen server
app.listen(process.env.PORT_APP, () =>
    console.log(`Server up & running in ${process.env.PORT_APP}`)
)

https.createServer(app).listen(8080)
