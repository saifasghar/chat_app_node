let apiInterceptor = new (require('../middlewares/apiInterceptorMiddleware'))(),
    authMiddleware = new (require('../middlewares/authMiddleware'))(),
    authContoller = new (require('../controllers/authController'))();


module.exports = (router) => {

    router.post('/login', authMiddleware.canLogin, apiInterceptor.setTemplate, authContoller.login)
    router.post('/signup', authMiddleware.canSignup, apiInterceptor.setTemplate, authContoller.signup)
    router.post('/verify-account', apiInterceptor.setTemplate, authContoller.verifyAccount)

    return router
}