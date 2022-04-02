let chatHistoryUserWise = [];
let chatHistoryRoomWise = [];
class RoomHistory{
    constructor(roomName , historyArr , nameSpaceName,  currentUserName){
        this.roomName = roomName;
        this.historyArr = historyArr;
        this.nameSpaceName = nameSpaceName;
        this.currentUserName = currentUserName;
    }

    
}

function add(roomName, historyObj , nameSpaceName , currentUserName){
    let historyArr = [];
    if(roomName && nameSpaceName && currentUserName && historyObj){
        if(chatHistoryUserWise && chatHistoryUserWise.length > 0 ){
        let existingUser = false;
        chatHistoryUserWise.forEach(chatObj =>{
            if(chatObj && chatObj.currentUserName == currentUserName){
                chatObj.historyArr.push({
                    currentChatMessage : historyObj.currentChatMessage,
                    currentTime : historyObj.currentTime
                });
                existingUser = true;
            }else{
                existingUser = false;
            }
        });
        if(!existingUser){
            historyArr.push({
                message : historyObj.currentChatMessage,
                timeStamp : historyObj.currentTime
            })
            chatHistoryUserWise.push( new RoomHistory(roomName, historyArr, nameSpaceName , currentUserName));    
        }
    }else{
            historyArr.push(historyObj);
            chatHistoryUserWise.push(new RoomHistory(roomName ,historyArr , nameSpaceName, currentUserName));
        }
}

    return chatHistoryUserWise;
}

function addHistoryRoomWise(roomName, historyObj , nameSpaceName , currentUserName){
    let historyArr = [];
    if(roomName && nameSpaceName && currentUserName && historyObj){
        if(chatHistoryRoomWise && chatHistoryRoomWise.length > 0 ){
        let existingUser = false;
        chatHistoryRoomWise.forEach(chatObj =>{
            if(chatObj && chatObj.roomName == roomName){
                chatObj.historyArr.push({
                    currentChatMessage : historyObj.currentChatMessage,
                    currentTime : historyObj.currentTime,
                    currentUserName : historyObj.currentUserName
                });
                existingUser = true;
            }else{
                existingUser = false;
            }
        });
        if(!existingUser){
            historyArr.push({
                currentChatMessage : historyObj.currentChatMessage,
                currentTime : historyObj.currentTime,
                currentUserName : historyObj.currentUserName
            })
            chatHistoryRoomWise.push( new RoomHistory(roomName, historyArr, nameSpaceName , currentUserName));    
        }
    }else{
            historyArr.push(historyObj);
            chatHistoryRoomWise.push(new RoomHistory(roomName ,historyArr , nameSpaceName, currentUserName));
        }
}
    return chatHistoryRoomWise;
}

function getCurrenRoomHistory(roomName){
    let responseObj = [];
    if(roomName && chatHistoryRoomWise.length > 0){
        chatHistoryRoomWise.forEach(chatObj =>{
            if(chatObj && chatObj.roomName == roomName){
                responseObj = chatObj;
            }   
        });
    }
    return responseObj;
}

module.exports.functions = {
    add , addHistoryRoomWise,getCurrenRoomHistory
};
