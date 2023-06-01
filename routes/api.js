let apiInterceptor = new (require('../middlewares/apiInterceptorMiddleware'))(),
    userController = new (require('../controllers/userController'))(),
    authMiddleware = new (require('../middlewares/authMiddleware'));


module.exports = (router) => {

    router.get('/test', userController.test);
    router.get('/friends/all', userController.fetchAllFriends);
    router.post('/friend/request/new', authMiddleware.isValidEmail, userController.sendFriendRequest);
    router.post('/friend/request/confirm', authMiddleware.isValidEmail, userController.acceptFriendRequest);
    router.get('/notifications/all', userController.fetchAllNotifications);
    router.post('/notifications/clear/:id', userController.clearNotifications);

    return router
}