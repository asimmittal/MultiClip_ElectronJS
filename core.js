const electron = require('electron');
const ipcMain = electron.ipcMain;
const {app, BrowserWindow} = electron;

app.on("ready", function(){

    //create the main window
    let mainWindow = new BrowserWindow({
        width: 400, 
        height: 800,
        resizable: false,
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
    
    //handle init events for both windows and save their event handles
    //we'll need them later to communicate between these windows
    ipcMain.on("mainWindow_init",(e,a)=>{ eventHandle_main = e;});
    ipcMain.on("clipWatcher_init",(e,a)=>{ eventHandle_clip = e;});

    //handle 'clipWatcher_newClip' -> fired by clipWatcher when new clip
    //data is available
    ipcMain.on("clipWatcher_newClip",(e,a)=>{
        //now push this to the mainWindow using its handle
        if(a) {
            eventHandle_main.sender.send('_newData',a);
        }
    });
});




