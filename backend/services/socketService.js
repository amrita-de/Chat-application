const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

exports.initSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Connected: ${socket.user.username}`);

    socket.on('send_message', async ({ content }) => {
      if (!content || !content.trim()) return;

      try {
        const message = new Message({
          senderId: socket.user.id,
          senderName: socket.user.username,
          content: content.trim(),
        });
        await message.save();

        io.emit('receive_message', {
          _id: message._id,
          senderId: socket.user.id,
          senderName: socket.user.username,
          content: message.content,
          timestamp: message.timestamp,
        });
      } catch (err) {
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected: ${socket.user.username}`);
    });
  });
};
