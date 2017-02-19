
import DataStore from "./dataStore";

/********************************************************************* 
 * Now render the application using the ClipList component
**********************************************************************/
import React from "react";
import ReactDOM from "react-dom";
import ClipList from "./clipList";

var listHandle = ReactDOM.render(<ClipList/>, document.getElementById("app"));

/********************************************************************* 
 * Setup the electron specific functionality viz. IPC to listen
 * to events from the main thread
**********************************************************************/
const electron = window.require("electron");
const ipc = electron.ipcRenderer;
const remote = electron.remote;

//send an init to the main process
ipc.send("mainWindow_init","");

//when new data is received from the main thread, simply
//save that new data item
ipc.on("_newData",(e,a)=>{
    if(a){ 
        new DataStore().save(a);
        listHandle.showDataStore();
    }
});

