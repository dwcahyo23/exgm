import controllers from '../controllers'
import { verifyToken } from '../middleware/verifyToken'

export default (app) => {
    app.get('/test', verifyToken, controllers.test)
    app.get('/ews', verifyToken, controllers._ews)
    app.post('/regusr', controllers.regUsr)
    app.post('/signin', controllers.signInUsr)
    app.post('/refrshtoken', controllers.refreshToken)

    app.post('/threeViewStatus', verifyToken, controllers._live_status)

    // route to login page
    app.get('/', (req, res) => {
        res.render('login')
    })

    // route to 404 page
    app.use((req, res, next) => {
        res.status(404).send('Page not found')
    })
}
