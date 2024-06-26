const Chat = require('../models/Chat');

exports.setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join chat', (chatId) => {
      socket.join(chatId);
    });

    socket.on('leave chat', (chatId) => {
      socket.leave(chatId);
    });

    socket.on('new message', async ({ chatId, message, sender }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) return;

        chat.messages.push({ sender, content: message });
        await chat.save();

        io.to(chatId).emit('message', { chatId, message, sender });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};