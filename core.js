const electron = require('electron');
const ipcMain = electron.ipcMain;
const {app, BrowserWindow} = electron;
const fs = require("fs");

app.on("ready", function(){

    //create the main window
    let mainWindow = new BrowserWindow({
        minWidth: 390, 
        width: 400,
        height: 800,
        title: "MultiClip",
        backgroundColor: '#ededed'   
    });

    let clipWatcher = new BrowserWindow({
        width: 0,
        height: 0,
        show: false
    });

    let eventHandle_main = null;
    let eventHandle_clip = null;

    //render the main window
    mainWindow.loadURL(`file://${__dirname}/dist/index.html`);
    mainWindow.webContents.openDevTools({mode: "detach"});

    //render the clip watcher window
    clipWatcher.loadURL(`file://${__dirname}/dist/clipwatcher.html`);    
    //clipWatcher.webContents.openDevTools({mode: "detach"});

    //handle init events for both windows and save their event handles
    //we'll need them later to communicate between these windows
    ipcMain.on("mainWindow_init",(e,a)=>{ eventHandle_main = e;});
    ipcMain.on("clipWatcher_init",(e,a)=>{ eventHandle_clip = e;});

    //handle 'clipWatcher_newClip' -> fired by clipWatcher when new clip
    //data is available
    ipcMain.on("clipWatcher_newClip",(e,data)=>{
        //now push this to the mainWindow using its handle
        if(data) {
            data.fileName = null;
        
            if(data['image']){
                var distDir = "./dist/" ;
                var fileName = data.id + ".png";
                data.fileName = fileName;
                fs.writeFileSync(distDir + fileName,data.image,"binary");
            }
            
            eventHandle_main.sender.send('_newData',data);
        }
    });
});




