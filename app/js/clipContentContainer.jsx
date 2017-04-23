import React from "react";
import DataStore from "./dataStore";
import Helpers from "./helpers";

class ClipContentContainer extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            item: new DataStore().clipboardContentItem
        }
    }
    
    render(){

        /**
         * let's figure out if the clipboard is empty or not. when the clipboard is empty, the object
         *      new DataStore().clipboardContentItem
         * will either be null or it will be an object with {text: "", fileName: null}
         * 
         * Based on whether the clipboard is empty or not, the clipContentContainer (this component) has
         * to show two different versions of itself
         * 
         * tip: You can manually empty the clipboard on a mac using "pbcopy < /dev/null".
         */
        var dom;
        var currentClip = new DataStore().clipboardContentItem;
        var isHollow = (!currentClip || 
                        (currentClip.text.length == 0 && 
                        (!currentClip.fileName || currentClip.fileName.length == 0))) ? true : false;

        //version where clipboard has content
        if(!isHollow){
            //let's determine what type of clip this is? (file, plaintext, url)
            var type = null;
            if(currentClip.fileName && currentClip.fileName.length > 0) type = 'file';
            else if(Helpers.isUrl(currentClip.text)) type = 'url';
            else type = 'text';

            var strClassIcon = "icon " + ((type == 'file') ? 'iconImage': 'iconText');
            var dateTimeString = currentClip.timeString;
            var contentBg = (type == 'file') ? currentClip.fileName : '';
            var contentHtml = (type != 'file') ? currentClip.text : <img src={contentBg}></img>;
            
            dom = (
                <div>
                    <div className="loader">
                        <div/>
                    </div>
                    <div className="content" >{contentHtml}</div>
                    <div className="meta">
                        <div className={strClassIcon}></div>
                        <div className="datetime">{dateTimeString}</div>
                    </div>
                </div>
            );
        }

        //version where empty
        else {
            dom = (
                <div className="hollow">
                    Your cliboard is empty
                </div>
            );
        }

        return dom;
    }
}

export default ClipContentContainer;
