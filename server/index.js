const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./config/db.js");
const router = require("./routes/route.js");
const server = require('http');
const io = require('socket.io')(server);

dotenv.config();
const app = express();

const port = process.env.PORT || 8043;
app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);
 
// io.sockets.on('connection',(socket)=>{
//     console.log('Success websocket');

//     socket.on('disconnect',(data)=>{
//         connections.splice(connections.indexOf(socket),1);
//         console.log('Disconnect websocket');
//     });

//     socket.on('send message',(data)=>{
//         try{
//         // Кто отправил - кому отправил - само сообщение
//         Message.create({ 

//         });
//         io.sockets.emit('new mess',{msg:data});
//         }catch(err){
//             console.log('Не удалось отправить сообщение');
//         }
//     });
// });

async function startApp(){
    try{
        app.listen(port, ()=> console.log(`Server running at port ${port}`));
    }catch(err){
        console.log('Error');
    }
}
startApp();