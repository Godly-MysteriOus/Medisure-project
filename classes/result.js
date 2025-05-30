const result = class Result{
    success;
    message;
    constructor(){
        this.success = false;
        this.message = '';
    }
    setSuccess(val){
        this.result = val;
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