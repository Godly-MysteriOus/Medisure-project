const path = require('path');
const dirName = path.join(__dirname).split(/medisure[\\/]/)[1];
const fileName = path.basename(__filename);
const logger = require('../../utils/Logger/logger')(`${dirName}\\${fileName}`);
const {validationResult} = require('express-validator');

exports.getCustomerSignupPage = (req,res,next)=>{
    logger.info('Inside getCustomerSignupPage method !!!');
    try{
        logger.debug('Returning the page and exiting from the function.');
        return res.status(200).render('preLogin/customerSignup.ejs',{
            isLoggedIn:false,
            landedPage:'customerSignUpPage',
        });
    }catch(e){
        logger.error('Error sending customer Signup page');
        logger.error(e);
    }
};
exports.addCustomer = (req,res,next)=>{
    logger.info('Inside addCustomer method !!!');
    const error = validationResult(req);
    if(!error.isEmpty()){
        logger.debug('Error during validation '+error.array());
        return res.status(400).json({
            success:false,
            message : error.array()[0],
        });
    }
    try{

    }catch(err){
        
    }
}