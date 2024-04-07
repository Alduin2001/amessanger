const { Message } = require('../models/index');

exports.sendMessage = async (req,res)=>{

    

}

exports.getMessage = async (req,res)=>{
    try{
        const messages = await Message.findAll();
        return res.send({'message':messages});
    }
    catch(err){
        return res.send({'message':'Сообщения не найдены'});
    }
}


// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const { Message } = require('../models/index');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });

//   socket.on('sendMessage', async (data) => {
//     try {
//       const { from, to, messageText } = data;
//       const newMessage = await Message.create({
//         from,
//         to,
//         message: messageText
//       });
//       io.emit('newMessage', newMessage); // Отправляем новое сообщение всем подключенным клиентам
//     } catch (err) {
//       console.error('Error sending message:', err);
//     }
//   });
// });

// exports.sendMessage = async (req, res) => {
//   // Этот код больше не нужен, потому что веб-сокеты обрабатывают отправку сообщений
// };

exports.getMessage = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.send(messages);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching messages' });
  }
};

// server.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });