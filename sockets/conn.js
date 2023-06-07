const { Server } = require("socket.io"),
    chatController = new (require('./chat')),
    disconnectController = new (require('./disconnect')),
    userController = new (require('../controllers/userController')),
    factory = require('../util/factory');


module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:4200", // Replace with your Angular frontend URL
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on('connection', async (socket) => {
        let token = socket.handshake.auth.token;
        if (token) {
            token = token.replace(/bearer /ig, "");
            if (token) {
                const decodedToken = await factory.helpers.verifyAndDecodeToken(token);
                if (decodedToken) {
                    userController.changeStatus(decodedToken.userEmail, 'connected');

                    socket.on('chat message', (msg) => {
                        chatController.sendMessage(msg)
                    });

                    socket.on('logout', () => {
                        socket.disconnect();
                    });

                    socket.on('disconnect', () => {
                        disconnectController.disconnectUser(decodedToken);
                    });

                }
            }
        }

    });
};
