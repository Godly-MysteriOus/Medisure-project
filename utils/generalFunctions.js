const path = require('path');
const projectRoot = path.resolve(__dirname, '../');
const filePathRelativeToRoot = path.relative(projectRoot, __filename);
const logger = require('../utils/Logger/logger')(filePathRelativeToRoot);

exports.IndianStandardTime = (extendedTime)=>{
    logger.info('Inside IndianStandardTime method!!!');
    logger.debug('Requested Extended time :'+extendedTime);
    let nowUTC = new Date();
    nowUTC = new Date(nowUTC.getTime()+extendedTime);
    let nowIST;
    if(nowUTC.toString().includes('India Standard Time')){
        logger.debug('Current Time is already in IST Format');
        nowIST = nowUTC;
    }else{
        logger.debug('Converting current time to UTC');
        nowIST = new Date(nowUTC.getTime()+(5.5*60*60*1000)+(extendedTime));
    }
    logger.debug('Returning date time :'+nowIST);
    return nowIST;
};
