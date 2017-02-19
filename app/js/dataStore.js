let _instance = null;
let _data = null;

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
}

export default DataStore;