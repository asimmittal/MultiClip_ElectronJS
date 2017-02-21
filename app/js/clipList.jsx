import React from "react";
import ClipItem from "./clipItem";
import DataStore from "./dataStore";

class ClipList extends React.Component{
    
    constructor(props,context){
        super(props,context);
        this.state = {
            items: new DataStore().componentData
        }
    }
    
    updateData(){
        this.setState({items: new DataStore().componentData});
    }

    render(){
        var clips = this.state.items.map((item,index)=>{return <ClipItem key={index} data={item}/>});
        return (
            <ul>{clips}</ul>
        );
    }
}


export default ClipList;
