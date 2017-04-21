import React from "react";
import ClipItem from "./clipItem";
import ClipContentContainer from "./clipContentContainer";
import DataStore from "./dataStore";

class ClipList extends React.Component{
    
    constructor(props,context){
        super(props,context);
        this.state = {
            items: new DataStore().componentData
        }

        this.clipItemSelected = this.clipItemSelected.bind(this);
    }

    clipItemSelected(item){
        if(this.props.actionSelected){ 
            this.props.actionSelected(item);
            this.updateData();
        }
    }
    
    updateData(){
        this.setState({items: new DataStore().componentData});
    }

    render(){

        return (
            <div className="flexbox-parent">
                <div className="clipContentArea">
                    <ClipContentContainer/>
                </div>
                <div className="listContentArea fill-remaining">
                    
                </div>
            </div>
        );
    }
}


export default ClipList;
