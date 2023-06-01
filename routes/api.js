let apiInterceptor = new (require('../middlewares/apiInterceptorMiddleware'))(),
    userController = new (require('../controllers/userController'))(),
    authMiddleware = new (require('../middlewares/authMiddleware'));


module.exports = (router) => {

    router.get('/test', apiInterceptor.setTemplate, userController.test);
    router.get('/friends/all', apiInterceptor.setTemplate, userController.fetchAllFriends);
    router.post('/friend/request/new', authMiddleware.isValidEmail, apiInterceptor.setTemplate, userController.sendFriendRequest);
    router.get('/notifications/all', apiInterceptor.setTemplate, userController.fetchAllNotifications);

    return router
}