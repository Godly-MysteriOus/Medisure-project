const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DBName = require('../DBNames');

const update_agent = new Schema({
    message:{
        type:String,
        required:true,
    },
    createDate:{
        type:String,
        required:true,
    },
    createTime : {
        type: String,
        required:true,
    }
});
module.exports = mongoose.model(DBName.testCronDB,update_agent,DBName.testCronDB);