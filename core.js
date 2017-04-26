const electron = require('electron');
const ipcMain = electron.ipcMain;
const {app, BrowserWindow, nativeImage, clipboard} = electron;
const fs = require("fs");
const uuid = require("node-uuid");
const ClipWatcher = require("./clipWatcher");


var distDir = "./dist/";
var saveDir = "./saved/";
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

    //create save directory if it doesn't already exist
    if(!fs.existsSync(saveDir)){
        console.log("===> creating save directory");
        fs.mkdirSync(saveDir);
    }

    //handle init events for both windows and save their event handles
    //we'll need them later to communicate between these windows
    ipcMain.on("mainWindow_init",(e,a)=>{ eventHandle_main = e;});

    //If the UI needs a file to be pasted back on the clipboard, the main
    //process will turn the file into the native image and send it to the
    //clip watcher to put back on the clipboard
    ipcMain.on("pasteFile", (e,dataItem)=>{ 
        if(dataItem['fileName'] && dataItem.fileName.length > 0){
            var filePath = saveDir + dataItem.fileName;
            if(fs.existsSync(filePath)){
                var nImage = nativeImage.createFromPath(filePath);
                clipWatcher.pasteNativeImage(nImage,dataItem.plaintext);
            }
        }
    });

    //create a clip watcher and tell it what to do when it finds a new clipping
    //on the clipboard. Whenever a new clipping is found, turn it into a data packet
    //that the app will understand, send it to the app via ipc. if the clipping is
    //an image, then save the image in the "savedDir" directory
    var clipWatcher = new ClipWatcher((content)=>{

        var _id = uuid.v1();
        var packetToSend = {
            plaintext: content.plaintext,
            id: _id,
            fileName: null,
            timestamp: new Date()
        };

        if(eventHandle_main) eventHandle_main.sender.send('_newClipStart',packetToSend);

        if(content.isImage && content.image){
            var imageData = content.image.toPNG();
            var fileName = _id + ".png";
            fs.writeFileSync(saveDir + fileName, imageData, "binary");
            packetToSend.fileName = "." + saveDir+fileName;
        }
        
        if(eventHandle_main) eventHandle_main.sender.send('_newData',packetToSend);
    });

    clipWatcher.startWatching();
});

