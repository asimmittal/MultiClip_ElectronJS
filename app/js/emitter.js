
import FBEmitter from "fbemitter";
let _emitter = new FBEmitter.EventEmitter();

class Events {
    static on(eventName, eventHandler){
        _emitter.addListener(eventName, eventHandler);
    }

    static send(eventName, args){
        _emitter.emit(eventName, args);
    }
}

export default Events;

