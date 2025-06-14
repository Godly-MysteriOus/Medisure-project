const result = class Result{
    success;
    message;
    constructor(){
        this.success = false;
        this.message = '';
    }
    setSuccess(val){
        this.success = val;
    }
    setMessage(message){
        this.message = message;
    }
    getMessage(){
        return this.message;
    }
    getSuccess(){
        return this.success;
    }
}
module.exports = result;