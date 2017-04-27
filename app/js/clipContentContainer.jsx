import React from "react";
import DataStore from "./dataStore";
import Helpers from "./helpers";
import Events from "./emitter";

class ClipContentContainer extends React.Component{

    constructor(props){
        super(props);

        this.deltaY = 80;

        this.state = {
            item: new DataStore().clipboardContentItem,
            inProgress: false,
            isDown: false
        }

        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.slideDown = this.slideDown.bind(this);
        this.slideUp = this.slideUp.bind(this);
        this.handleClick = this.handleClick.bind(this);

        Events.on('newClipStart', this.showLoader);
        Events.on('newClipEnd', this.hideLoader)
    }

    handleClick(){

    }
    
    showLoader(){
        this.setState({inProgress: true, isDown: true});
    }

    hideLoader(){
        this.setState({inProgress: false, isDown: true});
    }

    slideDown(){
        this.setState({isDown: true});
    }

    slideUp(){
        this.setState({isDown: false});
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
            var contentPadding = (type != 'file') ? '5px' : '0';
            var contentHtml = (type != 'file') ? currentClip.text : <img src={contentBg}></img>;
            var loaderStyle = {display: (this.state.inProgress) ? 'block' : 'none'};
            var delY = (this.state.isDown) ? this.deltaY : 0;

            var outerStyle = {
                transform: 'translateY(' + delY + 'px)'
            };

            dom = (
                <div style={outerStyle} onClick={this.handleClick}>
                    <div className="loader" style={loaderStyle}>
                        <div/>
                    </div>
                    <div className="content" style={{padding: contentPadding}}>{contentHtml}</div>
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
