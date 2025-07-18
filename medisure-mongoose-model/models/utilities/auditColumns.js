const auditCols = {
    createdAt:{type:Date,required:true},
    createTime:{type:String,required:true},
    updatedAt : {type:Date},
    updateTime : {type:String},
    isDeleted  : {type:Boolean, required:true,default:false}, 
};

module.exports = auditCols;