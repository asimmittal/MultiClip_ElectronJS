const electron = window.require("electron");
const ipc = electron.ipcRenderer;
const remote = electron.remote;

ipc.send("mainWindow_init","");

ipc.on("_newData",(e,a)=>{
    console.log("--> received data @", new Date());
    console.log(a);
});