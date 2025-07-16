const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbNames = require('../DB_Utils/DBNames');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const emailTemplates = new Schema({
    templateId:{
        type:Number,
    },
    emailSubject:{
        type:String,
        required:true,
    },
    textContent:{
        type:String,
        required:true,
    },
    htmlContent:{
        type:String,
        required:true,
    },
});
emailTemplates.plugin(AutoIncrement,{inc_field:'templateId'});
module.exports = mongoose.model(dbNames.emailTemplatesDB,emailTemplates,dbNames.emailTemplatesDB);