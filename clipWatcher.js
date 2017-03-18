var clipboard = require("electron").clipboard;

class ClipWatcher{
    constructor(callback = null){
        this.clipContent = {
            image: null,
            html: null,
            plaintext: null,
            isImage: null
        };

        this.oldContent = null;
        this.interval = null;
        this.callback = callback;
    }

    getClipboardData(){
        var availFormats = clipboard.availableFormats();
        for(var index in availFormats){
            var contentType = availFormats[index];
            this.clipContent.isImage = false;

            if(contentType.indexOf("image")>=0) {
                this.clipContent.image = clipboard.readImage();
                this.clipContent.isImage = true;
            }
            else if(contentType.indexOf("html")>=0) this.clipContent.html = clipboard.readHTML();
            else if(contentType.indexOf("plain")>=0) this.clipContent.plaintext = clipboard.readText();
        }

        var doNext = true;

        //if the content you grab hasn't changed then ignore the callback action
        if(this.clipContent.image != null && this.clipContent.plaintext == this.oldContent) {
            doNext = false;
        }
        else if(this.clipContent.plaintext == this.oldContent) doNext = false;

        if(doNext && this.callback){
            this.oldContent = this.clipContent.plaintext;
            this.callback(this.clipContent);
        }
    }

    pasteNativeImage(nativeImageObject, text){
        if(nativeImageObject){
            clipboard.writeImage(nativeImageObject);
            this.clipContent.plaintext = text;
        }
    }

    startWatching(){
        this.interval = setInterval(()=>{
            this.getClipboardData();
        },500);
    }

    stopWatching(){
        if(this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
};

module.exports = ClipWatcher;
