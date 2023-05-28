let apiInterceptor = new (require('../middlewares/apiInterceptorMiddleware'))(),
    userController = new (require('../controllers/userController'))();


module.exports = (router) => {

    router.get('/test', apiInterceptor.setTemplate, userController.test);

    return router
}