let apiInterceptor = new (require('../middlewares/apiInterceptorMiddleware'))(),
    userController = new (require('../controllers/userController'))(),
    authMiddleware = new (require('../middlewares/authMiddleware'));


module.exports = (router) => {

    // FRIENDS
    router.get('/friends/all', userController.fetchAllFriends);

    // FRIEND REQUESTS
    router.get('/friend/requests/all', userController.fetchAllFriendRequests);
    router.post('/friend/request/new', authMiddleware.isValidEmail, userController.sendFriendRequest);
    router.post('/friend/request/confirm', authMiddleware.isValidEmail, userController.acceptFriendRequest);
    router.post('/friend/request/reject', authMiddleware.isValidEmail, userController.rejectFriendRequest);

    // NOTIFICATIONS
    router.get('/notifications/all', userController.fetchAllNotifications);
    router.post('/notifications/clear/:id', userController.clearNotifications);

    return router
}