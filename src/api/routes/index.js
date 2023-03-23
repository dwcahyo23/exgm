import controllers from '../controllers'
import { verifyToken } from '../middleware/verifyToken'

export default (app) => {
    app.get('/test', verifyToken, controllers.test)
    app.get('/exgm', verifyToken, controllers._ews)
    app.post('/signin', controllers.signInUsr)
}
