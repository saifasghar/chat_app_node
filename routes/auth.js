let apiInterceptor = new (require('../middlewares/apiInterceptorMiddleware'))(),
    authMiddleware = new (require('../middlewares/authMiddleware'))(),
    authContoller = new (require('../controllers/authController'))();


module.exports = (router) => {

    router.post('/login', authMiddleware.canLogin, authContoller.login)
    router.post('/signup', authMiddleware.canSignup, authContoller.signup)
    router.post('/verify-account', authContoller.verifyAccount)
    router.post('/forgot-password', authMiddleware.isValidEmail, authContoller.sendResetPasswordEmail)
    router.post('/reset-password', authMiddleware.isValidPassword, authContoller.resetPassword)
    router.get('/verify-token', authContoller.verifyTokenAuthenticity)

    return router
}