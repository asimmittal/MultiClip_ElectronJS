import React from "react";

class ClipItem extends React.Component{
    render(){
        var data = this.props.data;
        var isImage = (data.fileName && data.fileName.length > 0) ? true: false;
        var imgStyle = (isImage) ? 'block' : 'none';
        var filePath = (isImage) ? data.fileName : "";
        var classType = (isImage) ? "image" : "text";
        
        var label = data.text;
        var lblStyle = (!isImage) ? 'block' : 'none';
        var tstamp = data.timeString;
        
        return(
            <li className="clipItem">
                <div className={"typeIcon " + classType}></div>
                <div className="container">
                    <div className="label" style={{display: lblStyle}}>{label}</div>
                    <div className="img" style={{display: imgStyle, backgroundImage: "url('"+ filePath + "')", backgroundSize: 'cover'}}></div>
                    <div className="tstamp">{tstamp}</div>
                </div>
            </li>
        );
    }
}

export default ClipItem;

