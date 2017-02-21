const electron = window.require("electron");
const ipc = electron.ipcRenderer;
const remote = electron.remote;
const clipboard = electron.clipboard;
const uuid = require("node-uuid");

var lastContent = null;

ipc.send("clipWatcher_init","");

function getClipboardData(){
    
    var listFormats = clipboard.availableFormats();
    var currContent = {
        image: null,
        html: null,
        plaintext: null,
    };

    //discern content type
    for(var index in listFormats){
        var contentTypeString = listFormats[index].trim().toLowerCase();
        if(contentTypeString.indexOf("image") >= 0) currContent.image = clipboard.readImage();
        else if(contentTypeString.indexOf("html") >= 0) currContent.html = clipboard.readHTML();
        else if(contentTypeString.indexOf("plain") >= 0) currContent.plaintext = clipboard.readText();
    }

    //decide whether its worth notifying the app
    var doNext = true;
    if(currContent.image != null && currContent.plaintext == lastContent) doNext = false;
    else if(currContent.plaintext == lastContent) doNext = false;

    //notify the app. Also if the content is an image, then encode it
    //and save it on the filesystem
    if(doNext){
        lastContent = currContent.plaintext;
        currContent['id'] = uuid.v1();
        if(currContent.image) currContent.image = currContent.image.toPNG();
        console.log("--> clipped", currContent);
        ipc.send("clipWatcher_newClip",currContent);
    }
}

setInterval(getClipboardData,500);