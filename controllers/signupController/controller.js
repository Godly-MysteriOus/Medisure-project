const path = require('path');
const projectRoot = path.resolve(__dirname, '../');
const filePathRelativeToRoot = path.relative(projectRoot, __filename);
const logger = require('../../utils/Logger/logger')(filePathRelativeToRoot);
const {validationResult} = require('express-validator');
const mongoose = require('mongoose');
const loginInfoDB = require('../../models/loginDetails');
const customerInfoDB = require('../../models/customerDetails');
const bcrypt = require('bcrypt');
const Result = require('../../classes/result');
const {ObjectId} = require('mongodb');
const DB_Names = require('../../DB_Utils/DBNames');
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
/**
 * This method adds signs up customer to database.
 *  1) Check whether user already exists or not
 *  2) If user does not exists, check whether email is verified or not
 *  3) Create entry in loginDB and customerDetailDB
 *  3) Finally update loginDB with entityModel and entityObject and save
 */
exports.addCustomer = async(req,res,next)=>{
    logger.info('Inside addCustomer method !!!');
    const error = validationResult(req);
    if(!error.isEmpty()){
        logger.debug('Error during validation '+error.array()[0].msg);
        console.log(error.array());
        return res.status(400).json({
            success:false,
            message : error.array()[0],
        });
    }

    const {customerName,customerEmailId,customerPassword,customerMobileNumber} = req.body;
    const result = new Result();
    let transactionSession = await mongoose.startSession();
    transactionSession.startTransaction();;
    const resultArr = [];
    try{
        if(!req.session.isEmailVerified){
            resultArr.push('Please Verify Email Id');
            throw new Error('Please Verify Email Id');
        }
        logger.debug('Checking whether user exists with emailId :'+customerEmailId);
        const isExistingUser = await loginInfoDB.findOne({emailId:customerEmailId});
        if(isExistingUser){
            logger.debug('User Already Exists with given emailId : '+customerEmailId);
            resultArr.push('User Already Exists, Please Login');
            throw new Error('User Already Exists, Please Login');
        }
        logger.debug('Customer do not exists with the emailId: '+customerEmailId);

        const hashedPassword = await bcrypt.hash(customerPassword,12);
        logger.debug('Hashed password successfully!!!');
        let loginDetail = await loginInfoDB.create([{emailId:customerEmailId,password:hashedPassword,roleId:1}],{session:transactionSession});
        loginDetail = loginDetail.pop();
        if(!loginDetail){
            logger.error('Unable to save data in login_info DB');
            resultArr.push('Error Registering User');
            throw new Error('Error Registering User');
        }
        logger.debug('Entry made into login_info DB Successfully !!!');
        let userDetail = await customerInfoDB.create([{customerName:customerName,emailId:new ObjectId(loginDetail._id),mobileNumber:customerMobileNumber,password:new ObjectId(loginDetail._id),cart:{items:[],totalPrice:0},createdAt:new Date(),isDeleted:0}],{session:transactionSession});
        userDetail = userDetail.pop();
        logger.debug('Entry made into customer_info DB Successfully');
        if(!userDetail){
            logger.error('Unable to save data in customer_info DB');
            resultArr.push('Error Registering User');
            throw new Error('Error Registering User');
        }
        loginDetail.entityObject = userDetail._id;
        loginDetail.entityModel = DB_Names.userRegistrationDB;
        await loginDetail.save();
        logger.debug('User Created successfully with emailId : '+customerEmailId+" at time : "+userDetail.createdAt);
        logger.debug('Clearing session items');
        delete req.session.emailId;
        delete req.session.isEmailVerified;
        logger.debug('Cleared session items successfully !!!');
        await transactionSession.commitTransaction();
        res.status(200).json({
            success:true,
            message:'SignUp Successful',
        });
    }catch(err){
        await transactionSession.abortTransaction();
        if(resultArr.indexOf(err.message) == -1){
            result.setMessage('Error Occoured, Please try again later');
            logger.error(err.stack);
        }else{
            result.setMessage(err.message);
        }
        result.setSuccess(false);
        logger.error('Message : '+result.getMessage()+"  Success :"+result.getSuccess());
        res.status(400).json({
            success:result.getSuccess(),
            message: result.getMessage(),
        });
    }finally{
        await transactionSession.endSession();
    }
}