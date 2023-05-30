let apiInterceptor = new (require('../middlewares/apiInterceptorMiddleware'))(),
    authMiddleware = new (require('../middlewares/authMiddleware'))(),
    authContoller = new (require('../controllers/authController'))();


module.exports = (router) => {

    router.post('/login', authMiddleware.canLogin, apiInterceptor.setTemplate, authContoller.login)
    router.post('/signup', authMiddleware.canSignup, apiInterceptor.setTemplate, authContoller.signup)
    router.post('/verify-account', apiInterceptor.setTemplate, authContoller.verifyAccount)
    router.post('/forgot-password', authMiddleware.isValidEmail, apiInterceptor.setTemplate, authContoller.sendResetPasswordEmail)
    router.post('/reset-password', authMiddleware.isValidPassword, apiInterceptor.setTemplate, authContoller.resetPassword)
    router.get('/verify-token', apiInterceptor.setTemplate, authContoller.verifyTokenAuthenticity)

    return router
}