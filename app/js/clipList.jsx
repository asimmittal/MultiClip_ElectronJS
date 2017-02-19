import React from "react";
import ClipItem from "./clipItem";
import DataStore from "./dataStore";

class ClipList extends React.Component{
    showDataStore(){
        console.log("---> data store length:", new DataStore().data.length);
    }

    render(){
        return (
            <ul>
                <ClipItem/>
                <ClipItem/>
            </ul>
        );
    }
}


export default ClipList;
