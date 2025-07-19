const sharedModule = require('medisure-mongoose-model');
const generalFunction = require('../../utils/generalFunctions');
const path = require('path');
const projectRoot = path.resolve(__dirname, '../');
const filePathRelativeToRoot = path.relative(projectRoot, __filename);
const logger = require('../../utils/Logger/logger')(filePathRelativeToRoot);


exports.createTestEntry = async(req,res,next)=>{
    logger.info('Inside createTestEntry method !!!');
    try{
        const time = generalFunction.IndianStandardTime(0).toString().split(' ')[4];
        const date = new Date().toISOString().split('T')[0];
        const createEntry = await sharedModule.testCronDB.create({message:'Hi',createDate:date,createTime:time});
        logger.debug('Created test entry successfully');
        if(createEntry){
            return res.status(200).json({
                success:true,
                message:'Successfully created the entry'
            });
        }else{
            return res.status(400).json({
                success:false,
                message:'Error creating entry',
            });
        }
    }catch(err){
        logger.error('Error inside createTestEntry method !!!');
        logger.error(err);
        return res.status(400).json({
            success:false,
            message:'Error Occoured, Try again later',
        });
    }
}