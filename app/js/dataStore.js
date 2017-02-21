let _instance = null;
let _data = null;

function getDateString(dateObj){
    if(dateObj && dateObj.constructor.name.toLowerCase() == "date"){
        var parts = ("" + dateObj).split(" ");
        var mm = parts[1];
        var dd = parts[2];
        var yy = parts[3];
        return mm + " " + dd + ", " + yy;
    }
    
    return "";
}


class DataStore{
    constructor(){
        if(!_instance){
            _data = [];
            _instance = this;
        }

        return _instance;
    }

    get data(){
        return _data;
    }

    save(item){
        if(item) _data.unshift(item);
    }

    get componentData(){
        var toReturn = _data.map((item)=>{
            return {
                id: item.id,
                text: item.plaintext,
                fileName: item.fileName,
                timeString: getDateString(item.timestamp)
            }
        });

        return toReturn;
    }
}

export default DataStore;