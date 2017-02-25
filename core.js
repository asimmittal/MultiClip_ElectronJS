const electron = require('electron');
const ipcMain = electron.ipcMain;
const {app, BrowserWindow} = electron;
const fs = require("fs");
const uuid = require("node-uuid");
const ClipWatcher = require("./clipWatcher");

var distDir = "./dist/";
var eventHandle_main = null;

app.on("ready", function(){

    //create the main window
    let renderProc = new BrowserWindow({
        minWidth: 390, 
        width: 400,
        height: 800,
        title: "MultiClip",
        backgroundColor: '#ededed'   
    });

    //render the main window
    renderProc.loadURL(`file://${__dirname}/dist/index.html`);
    renderProc.webContents.openDevTools({mode: "detach"});

    //handle init events for both windows and save their event handles
    //we'll need them later to communicate between these windows
    ipcMain.on("mainWindow_init",(e,a)=>{ eventHandle_main = e;});

    //create a clip watcher and start monitoring the clipboard for changes
    var clipWatcher = new ClipWatcher(distDir, actionOnNewClip);
    clipWatcher.startWatching(uuid);
});

function actionOnNewClip(content){

    //new clipboard content was posted, do something with it
    var _id = uuid.v1();

    var packetToSend = {
        plaintext: content.plaintext,
        id: _id,
        fileName: null,
        timestamp: new Date()
    };

    if(content.isImage && content.image){
        var imageData = content.image.toPNG();
        var fileName = _id + ".png";
        fs.writeFileSync(distDir + fileName, imageData, "binary");
        packetToSend.fileName = fileName;
    }

    
    //post this slightly slimmer packet to the render process
    if(eventHandle_main) eventHandle_main.sender.send('_newData',packetToSend);
}

