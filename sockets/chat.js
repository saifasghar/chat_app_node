module.exports = class ChatController {

    sendMessage(msg) {
        console.log('Received message:', msg);
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    }
}