/**
 * Helpers
 * Class with a bunch of helper functions
 */
class Helpers{

    /**
     * isUrl(...)
     * Returns true if 'strParam' is a url of some sort
     * @param {*} strParam 
     */
    static isUrl(strParam){
        var exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
        var regex = new RegExp(exp);
        return (strParam.match(regex));
    }
}

export default Helpers;