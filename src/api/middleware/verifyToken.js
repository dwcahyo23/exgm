import jwt from 'jsonwebtoken'
import { _muser } from '../models/_muser'

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    const isMatch = await _muser.findAll({ where: { token: token } })
    if (isMatch.length === 0) {
        return res.sendStatus(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403)
        req.id = decoded.id
        next()
    })
}
