import React from "react";
import DataStore from "./dataStore";

class ClipContentContainer extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            item: new DataStore().clipboardContentItem
        }
    }

    render(){
        var isHollow = (this.state.item != null) ?  false : true;
        return(
            <div>
                <div className="nocontent"><p>Nothing on clipboard</p></div>
            </div>
        );
    }
}

export default ClipContentContainer;
