exports.IndianStandardTime = (extendedTime)=>{
    logger.info('Inside IndianStandardTime method!!!');
    const nowUTC = new Date()+extendedTime;
    let nowIST;
    if(nowUTC.toString().includes('Indian Standard Time')){
        nowIST = nowUTC;
    }else{
        nowIST = new Date(nowUTC.getTime()+(5.5*60*60*1000)+(extendedTime));
    }
    return nowIST;
};
