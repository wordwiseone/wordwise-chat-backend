// controllers/chatController.js
const Chat = require('../models/Chat');
const User = require('../models/User');

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.userId })
      .populate('participants', 'username')
      .select('-messages');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats' });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { participantUsername } = req.body;
    const participant = await User.findOne({ username: participantUsername });
    if (!participant) return res.status(404).json({ message: 'User not found' });
    
    const newChat = new Chat({
      participants: [req.user.userId, participant._id],
    });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('messages.sender', 'username');
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};