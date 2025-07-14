const path = require('path');
const projectRoot = path.resolve(__dirname, '../');
const filePathRelativeToRoot = path.relative(projectRoot, __filename);
const logger = require('../utils/Logger/logger')(filePathRelativeToRoot);

exports.IndianStandardTime = (extendedTime)=>{
    logger.info('Inside IndianStandardTime method!!!');
    const nowUTC = new Date(new Date()+extendedTime);
    let nowIST;
    if(nowUTC.toString().includes('Indian Standard Time')){
        nowIST = nowUTC;
    }else{
        nowIST = new Date(nowUTC.getTime()+(5.5*60*60*1000)+(extendedTime));
    }
    logger.debug('Returning date time :'+nowIST);
    return nowIST;
};
