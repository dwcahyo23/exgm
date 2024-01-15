import { _muser } from '../models/_muser'
import { _ews } from '../models/_ews'

import bcrypt from 'bcrypt'
import _ from 'lodash'
import Base64 from 'crypto-js/enc-base64.js'
import HmacSHA256 from 'crypto-js/hmac-sha256.js'
import Utf8 from 'crypto-js/enc-utf8.js'
import jwtDecode from 'jwt-decode'
import axios from 'axios'

function base64url(source) {
    // Encode in classical base64
    let encodedSource = Base64.stringify(source)

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '')

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-')
    encodedSource = encodedSource.replace(/\//g, '_')

    // Return the base64 encoded string
    return encodedSource
}

function generateJWTToken(tokenPayload) {
    // Define token header
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    }

    // Calculate the issued at and expiration dates
    const date = new Date()
    const iat = Math.floor(date.getTime() / 1000)
    const exp = Math.floor(date.setDate(date.getDate() + 30) / 1000)

    // Define token payload
    const payload = {
        iat,
        iss: 'EXGM',
        exp,
        ...tokenPayload,
    }

    // Stringify and encode the header
    const stringifiedHeader = Utf8.parse(JSON.stringify(header))
    const encodedHeader = base64url(stringifiedHeader)

    // Stringify and encode the payload
    const stringifiedPayload = Utf8.parse(JSON.stringify(payload))
    const encodedPayload = base64url(stringifiedPayload)

    // Sign the encoded header and mock-api
    let signature = `${encodedHeader}.${encodedPayload}`
    signature = HmacSHA256(signature, process.env.ACCESS_TOKEN_SECRET)
    signature = base64url(signature)

    // Build and return the token
    return `${encodedHeader}.${encodedPayload}.${signature}`
}

function verifyJWTToken(token) {
    // Split the token into parts
    const parts = token.split('.')
    const header = parts[0]
    const payload = parts[1]
    const signature = parts[2]

    // Re-sign and encode the header and payload using the secret
    const signatureCheck = base64url(
        HmacSHA256(`${header}.${payload}`, process.env.ACCESS_TOKEN_SECRET)
    )

    // Verify that the resulting signature is valid
    return signature === signatureCheck
}

function isTokenExpired(token) {
    const payloadBase64 = token.split('.')[1]
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString()
    const decoded = JSON.parse(decodedJson)
    const exp = decoded.exp
    let newDate = new Date()
    newDate.setTime(exp * 1000).toLocaleString()
    return newDate
}

export default {
    async test(req, res) {
        try {
            res.status(200).send({
                message: 'Authenticated.',
            })
        } catch (err) {
            res.status(500).send({
                message:
                    'Could not perform operation at this time, kindly try again later.',
            })
        }
    },

    async regUsr(req, res) {
        const { username, password, confPassword } = req.body
        if (password !== confPassword)
            return res
                .status(400)
                .json({ message: 'Password and confirm password do not match' })
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)
        const error = []
        try {
            const isExists = await _muser.findAll({
                where: { username },
            })

            if (isExists.length > 0) {
                error.push({
                    message: 'username is already in use',
                })
            }

            if (error.length === 0) {
                await _muser.create({
                    username,
                    password: hashPassword,
                })
                return res
                    .status(200)
                    .json({ message: 'Registration successful' })
            }
            return res.status(400).json(error)
        } catch (error) {
            console.log(error)
        }
    },

    async signInUsr(req, res) {
        const { username, password } = req.body
        const error = []
        try {
            const userFind = await _muser.findAll({})

            const isUser = _.cloneDeep(
                userFind.find((_user) => _user.username === username)
            )

            if (!isUser) {
                error.push({
                    message: 'Check your username',
                })
            }

            if (isUser) {
                const match = await bcrypt.compare(password, isUser.password)
                if (!match) {
                    error.push({
                        message: 'Check your password',
                    })
                }
            }

            if (error.length === 0) {
                const access_token = generateJWTToken({ id: isUser.id_user })
                res.cookie('_id', isUser.id_user, {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true,
                })
                const exp = isTokenExpired(access_token)
                return res.render('loged', { token: isUser.token, exp: exp })
            }
            // return res.status(400).json(error)
            return res.send(`check your username & password`)
        } catch (error) {
            console.log(error)
        }
    },

    async refreshToken(req, res) {
        const { _id } = req.cookies
        try {
            const access_token = generateJWTToken({ id: _id })
            await _muser.update(
                { token: access_token },
                {
                    where: {
                        id_user: _id,
                    },
                }
            )
            const exp = isTokenExpired(access_token)
            return res.render('loged', { token: access_token, exp: exp })
        } catch (error) {
            console.log(error)
        }
    },

    async accessToken(req, res) {
        const { access_token } = req.body
        try {
            if (verifyJWTToken(access_token)) {
                const { id } = jwtDecode(access_token)
                const isUser = await _muser.findOne({
                    where: { id_user: id },
                    attributes: { exclude: ['password'] },
                })
                const updatedAccessToken = generateJWTToken({
                    id: isUser.id_user,
                })
                await _muser.update(
                    { token: updatedAccessToken },
                    {
                        where: {
                            id_user: isUser.id_user,
                        },
                    }
                )
                const response = {
                    access_token: updatedAccessToken,
                }
                return res.status(200).json(response)
            }
        } catch (error) {}
    },

    async _ews(req, res) {
        const error = []
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            const findAccess = await _muser.findOne({ where: { token: token } })

            if (findAccess.no_ex.length < 1) {
                error.push({
                    message: 'no-ex not found',
                })
            }

            // console.log(findAccess.dakses)

            if (error.length === 0) {
                const response = await _ews.findAll({
                    where: { cst_no: findAccess.no_ex },
                })
                return res.status(200).json(response)
            }

            return res.status(400).json(error)
        } catch (error) {
            console.log(error)
        }
    },

    async _live_status(req, res) {
        await axios({
            method: 'post',
            url: 'http://192.168.192.34:8080/api/master/machineInfo',
            data: { ...req.body },
            headers: { language: 'EN' },
        })
            .then((x) => {
                res.status(200).json(x.data)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    },
}
