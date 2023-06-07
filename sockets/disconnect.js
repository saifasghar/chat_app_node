let userController = new (require('../controllers/userController'));

module.exports = class DisconnectController {

    disconnectUser(decodedToken) {
        userController.changeStatus(decodedToken.userEmail, 'disconnected');
    }
}