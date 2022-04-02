class ServerData{
    constructor(nameSpaces , roomsArr){
        this.nameSpaces = nameSpaces;
        this.roomsArr = roomsArr;
    }
}

function addServerData(){
        return serverDataArr = [
                    new ServerData('/wiki' , ['New Articles','Editors' , 'Others']),
                    new ServerData('/mozilla' , ['Firefox', 'SeaMonkey', 'SpiderMonkey', 'Rust']),
                    new ServerData('/linux' , ['Debian', 'Redhat', 'MacOs', 'Kernel Development'])
            ];
}

function getServerData(){
        return addServerData();
    }

module.exports.getServerData = getServerData;
