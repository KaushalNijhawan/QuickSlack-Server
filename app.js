
let express = require('express');
let app = express();
let dataClientSend = require('./serverMiscFiles.js');
let socketio = require('socket.io');
let nameSpacesArr = ['/wiki', '/mozilla' , '/linux'];  
let functions = require('./roomChatHistory.js');
app.get('/' , (req, res)=>{
    res.send('Hello  From Main Route');
});
let server = app.listen(9000, function(){
    console.log('Server is listening !');
});

let io = socketio(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: false,
      }
});

let dataFromServer = dataClientSend.getServerData();
let chatHistoryRoomWise = {};
io.on('connection' , (mainsocket, req)=>{
    mainsocket.emit('joining' , nameSpacesArr);
});
dataFromServer.forEach(data=>{
    let currentRoomName = '';
    io.of(data.nameSpaces).on('connection', (nsSocket)=>{
        
        nsSocket.emit('onjoinednamespace' , {
            data : data.roomsArr
        });
        
        nsSocket.on('joinedroom' , async(roomDetails, updateChatHistory)=>{
            if(roomDetails && roomDetails.roomName && roomDetails.nameSpace){
                currentRoomName = roomDetails.roomName;
                // this callback is passing the updated number to the current socket joined
                let roomToLeave = Array.from(nsSocket.rooms).length > 1 ? Array.from(nsSocket.rooms)[1] : null;
                if(roomToLeave!= null){
                    nsSocket.leave(roomToLeave);
                    let leaveRoomUpdate = await io.of(data.nameSpaces).in(roomToLeave).allSockets();
                    io.of(data.nameSpaces).to(roomToLeave).emit('updateMembers' , leaveRoomUpdate.size);
                }
                nsSocket.join(roomDetails.roomName);
                
                let chatHistoryRoomWise = functions.functions.getCurrenRoomHistory(roomDetails.roomName);
                updateChatHistory(chatHistoryRoomWise);
                let numberOfUsers = await io.of(data.nameSpaces).in(roomDetails.roomName).allSockets(); 
                io.of(data.nameSpaces).to(roomDetails.roomName).emit('updateMembers' , numberOfUsers.size);
            }
        });
        
        nsSocket.on('messageToServer' , (datas)=>{
            if(datas && datas.currentChatMessage != '' && datas.currentUserName && datas.currentTime){
                let historObjRoom = {
                    currentChatMessage : datas.currentChatMessage,
                    currentTime : datas.currentTime,
                    currentUserName : datas.currentUserName
                }
                chatHistoryRoomWise = functions.functions.addHistoryRoomWise(datas.currentRoomName,historObjRoom, datas.currentNameSpace, datas.currentUserName );
                chatHistoryRoomWise = functions.functions.getCurrenRoomHistory(datas.currentRoomName);
                io.of(data.nameSpaces).to(datas.currentRoomName).emit('messageToClients' , chatHistoryRoomWise);
            }else if(datas.currentChatMessage == ''){
                
                chatHistoryRoomWise = functions.functions.getCurrenRoomHistory(datas.currentRoomName);
                io.of(data.nameSpaces).to(datas.currentRoomName).emit('messageToClients' , chatHistoryRoomWise);
            }
        });

    });
});

 
