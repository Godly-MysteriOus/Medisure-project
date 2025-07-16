const path = require('path');
const projectRoot = path.resolve(__dirname, '../');
const filePathRelativeToRoot = path.relative(projectRoot, __filename);
const logger = require('../../utils/Logger/logger')(filePathRelativeToRoot);
const {validationResult} = require('express-validator');
const mongoose = require('mongoose');
const loginInfoDB = require('../../models/loginDetails');
const customerInfoDB = require('../../models/customerDetails');
const sellerInfoDB = require('../../models/sellerDetails');
const bcrypt = require('bcrypt');
const Result = require('../../classes/result');
const {ObjectId} = require('mongodb');
const DB_Names = require('../../DB_Utils/DBNames');
const generalFunctions = require('../../utils/generalFunctions');
const fileUpload = require('../../utils/FileUploads/fileUpload');
const {cloudinary} = require('../../utils/FileUploads/cloudinary');
const commonController = require('../commonController');
/**
 * This method returns a renderable customer Signup page
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
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
        return res.status(400).json({
            success:false,
            message : error.array()[0].msg,
        });
    }

    const {customerName,customerEmailId,customerPassword,customerMobileNumber} = req.body;
    const result = new Result();
    let transactionSession = await mongoose.startSession();
    transactionSession.startTransaction();
    const resultArr = [];
    try{
        if(!req.session.isEmailVerified){
            resultArr.push('Please Verify Email Id');
            throw new Error('Please Verify Email Id');
        }
        logger.debug('Checking whether user exists with emailId :'+customerEmailId);
        const isExistingUser = await loginInfoDB.findOne({emailId:customerEmailId,roleId:1});
        if(isExistingUser){
            logger.debug('User Already Exists with given emailId : '+customerEmailId);
            resultArr.push('User Already Exists, Please Login');
            throw new Error('User Already Exists, Please Login');
        }
        logger.debug('Customer do not exists with the emailId: '+customerEmailId);

        const hashedPassword = await bcrypt.hash(customerPassword,12);
        logger.debug('Hashed password successfully!!!');

        const creationTime = generalFunctions.IndianStandardTime(0).toString().split(' ');
        const auditCol = {
            createdAt : Date(creationTime),
            createTime : creationTime[4],
            updatedAt : null,
            updateTime: null,
            isDeleted : false,
        }

        let loginDetail = await loginInfoDB.create([{emailId:customerEmailId,password:hashedPassword,mobileNo:customerMobileNumber,roleId:1,audit:auditCol}],{session:transactionSession});
        loginDetail = loginDetail.pop();
        if(!loginDetail){
            logger.error('Unable to save data in login_info DB');
            resultArr.push('Error Registering User');
            throw new Error('Error Registering User');
        }
        logger.debug('Entry made into login_info DB Successfully !!!');
        
        let userDetail = await customerInfoDB.create([{customerName:customerName,emailId:new ObjectId(loginDetail._id),mobileNumber:new Object(loginDetail._id),password:new ObjectId(loginDetail._id),cart:{items:[],totalPrice:0},audit:auditCol}],{session:transactionSession});
        userDetail = userDetail.pop();
        logger.debug('Entry made into customer_info DB Successfully');
        if(!userDetail){
            logger.error('Unable to save data in customer_info DB');
            resultArr.push('Error Registering User');
            throw new Error('Error Registering User');
        }
        loginDetail.entityObject = userDetail._id;
        loginDetail.entityModel = DB_Names.userRegistrationDB;
        logger.debug('Clearing session items');
        delete req.session.emailId;
        delete req.session.isEmailVerified;
        logger.debug('Cleared session items successfully !!!');
        await loginDetail.save();
        logger.debug('User Created successfully with emailId : '+customerEmailId+" at time : "+userDetail.audit.createTime);
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
/**
 * This method returns a seller Signup page
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getSellerSignupPage = (req,res,next)=>{
    logger.info("Inside getSellerSignupPage method !!!");
    try{
        logger.debug('Returning seller signup page');
        return res.status(200).render('preLogin/sellerSignup.ejs',{
            isLoggedIn : false,
            landedPage : 'sellerSignupPage',
        });
    }catch(err){
        logger.error('Error inside getSellerSignup method !!!');
        logger.error(e.stack);
    }
};
/**
 * This method makes an API call to common/pincode route via post method
 * @param {*} storePincode 
 * @returns 
 */
async function getLocationDetails(storePincode){
    logger.info('Inside getLocationDetails method');
    const requiredData = commonController.IndiaPost(storePincode);
    logger.debug('Returning response from India Post API');
    return requiredData;
}
/**
 * This method sets object used to save seller info into the db
 * Makes API call to /common/pincode to fetch state and city details based on pincode
 * @param {*} sellerName 
 * @param {*} loginInfo 
 * @param {*} storePincode 
 * @param {*} storeAddress 
 * @param {*} locationCoords 
 * @param {*} storeName 
 * @param {*} drugLicenseNumber 
 * @param {*} gstNumber 
 * @param {*} fssaiNumber 
 * @returns 
 */
async function setSellerObject(sellerName,loginInfo,storePincode,storeAddress,locationCoords,storeName,drugLicenseNumber,gstNumber,fssaiNumber){
    logger.info('Inside setSellerObject method !!!');
    const sellerDetail = {
        sellerName : sellerName,
        emailId : loginInfo._id,
        password : loginInfo._id,
        mobileNumber : loginInfo._id
    };
    logger.debug('Set sellerDetail object successfully');
    logger.debug('Making an API Call to India Post via pincode to fetch state and city info');
    const locationDetailFromPincode = await getLocationDetails(storePincode);
    const addressStructure = {
        state : locationDetailFromPincode.state,
        city : locationDetailFromPincode.city,
        pincode : storePincode,
        address : storeAddress,
        location:{
            type : 'Point',
            coordinates:[...locationCoords],
        }
    }
    logger.debug('Set addressStructure object successfully');
    const storeDetails = {
        storeName : storeName,
        address : addressStructure,
        logoDetails:{
            storeLogo : '',
            storeLogoPID : '',
            headerLogoForPDF : '',
            headerLogoPID : '',
            footerLogoForPDF : '',
            footerLogoPID : '',
        },
        workingDetails : [],
    };
    logger.debug('Set storeDetails object successfully');
    const storeRegistrationDetails = {
        drugLicenseNumber : drugLicenseNumber,
        gstNumber : gstNumber,
        fssaiNumber : fssaiNumber,
    }
    logger.debug('Set storeRegistrationDetails successfully !!!');
    logger.debug('Returning these are independent obejcts');
    return [sellerDetail,storeDetails,storeRegistrationDetails];
}
/**
 * This method adds seller into the database
 * 1) Check whether the emailId is verified or not
 * 2) Check if the location geo-coordinates are provided or not
 * 3) Checks if the user already exists
 * 4) Create entry in loginDB and sellerDB
 * 5) Delete validation objects from session
 * 6) Offload file upload and account mapping, so cron could pick this up and execute.
 * @returns JSON
 */
exports.addSeller = async(req,res,next)=>{
    logger.info('Inside addSeller method !!!');
    const error = validationResult(req);
    const result = new Result();
    if(!error.isEmpty()){
        result.setSuccess(false);
        result.setMessage(error.array()[0].msg);
        logger.error('Error inside addSeller Method during Validation :: '+result.getMessage());
        return res.status(400).json({
            success: result.getSuccess(),
            message : result.getMessage(),
        });
    }
    const resultArr = [];
    let transactionSession = await mongoose.startSession();
    transactionSession.startTransaction();
    // removed param locationCoords
    const {sellerName,sellerEmail,sellerPassword,sellerMobileNumber,storeName,drugLicenseNumber,gstNumber,fssaiNumber,storeAddress,storePincode} = req.body;
     try{
        if(!req.session.isEmailVerified){
            resultArr.push('Please Verify Email Id');
            logger.debug('Email Id unverified, cannot proceed further');
            throw new Error('Please Verify Email Id');
        }
        const locationCoords = [];
        // if(!locationCoords || locationCoords.size!=2){
        //     resultArr.push('Please Locate your store');
        //     logger.debug('Seller Didn\'t provided location coordinates. Locate your Store Button Not Clicked');
        //     throw new Error('Please Locate your store');
        // }
        const isSellerAlreadyPresent = await sellerInfoDB.findOne({'storeRegistrationDetails.drugLicenseNumber': drugLicenseNumber,'storeRegistrationDetails.gstNumber':gstNumber,'storeRegistrationDetails.fssaiNumber':fssaiNumber,'audit.isDeleted':false});

        if(isSellerAlreadyPresent){
            logger.debug(`Found a seller object with drugLicenseNumber : ${drugLicenseNumber} and GST Registration Number : ${gstNumber} and FSSAI Number : ${fssaiNumber}`);
            logger.debug('User already present and active');
            resultArr.push('User already exists. Please Login');
            throw new Error('User already exists. Please Login');
        };
         logger.debug(`No seller object found with drugLicenseNumber : ${drugLicenseNumber} and GST Registration Number : ${gstNumber} and FSSAI Number : ${fssaiNumber}`);
        const hashedPassword = await bcrypt.hash(sellerPassword,12);
        logger.debug('Hashed Password successfully');
        const creationTime = generalFunctions.IndianStandardTime(0).toString().split(' ');
        const auditCol = {
            createdAt : Date(creationTime),
            createTime : creationTime[4],
            updatedAt : null,
            updateTime: null,
            isDeleted : false,
        }
        logger.debug('Successfully set audit Columns');
        let loginInfo = await loginInfoDB.create([{emailId:sellerEmail,password:hashedPassword,mobileNo:sellerMobileNumber,roleId:2,audit:auditCol}],{session:transactionSession});
        if(loginInfo==null || loginInfo[0]==[]){
            logger.error('Error creating entry in login_info db');
            resultArr.push('Error Creating User');
            throw new Error('Error Creating User');
        }else{
            loginInfo = loginInfo.pop();
        }
        logger.debug('Saved Entry into the login_info db');
        const sellerObj = await setSellerObject(sellerName,loginInfo,storePincode,storeAddress,locationCoords,storeName,drugLicenseNumber,gstNumber,fssaiNumber);
        let userRegistration = await sellerInfoDB.create([{sellerDetails:sellerObj[0],storeDetails:sellerObj[1],storeRegistrationDetails:sellerObj[2],resetToken:null,resetTokenExpirationType:null,audit:auditCol}],{session:transactionSession});
        logger.debug('Saved Entry in seller_db');
        if(userRegistration==null || userRegistration[0] == []){
            logger.error('Error saving entry in store_db');
            resultArr.push('Error Creating User');
            throw new Error('Error Creating User');
        }else{
            userRegistration =  userRegistration.pop();
        }
        logger.debug('Deleting validation session objects');
        delete req.session.emailId;
        delete req.session.isEmailVerified;
        logger.debug('Deleted validation session onjects successfully');
        loginInfo.entityModel = DB_Names.sellerRegistrationDB;
        loginInfo.entityObject = userRegistration._id;
        await loginInfo.save();
        logger.debug('Updating login_info db with entity model and object');
        logger.debug('Offloading file url creation and account mapping');
        asyncFileUpload( userRegistration,req.files);
        await transactionSession.commitTransaction();
        logger.debug('Returning a success result');
        return res.status(200).json({
            success: true,
            message : 'Signup Successful',
        });
    }catch(err){
        logger.error('Error in addSeller Method ');
        logger.error(err);
        if(resultArr.findIndex(msg=> msg == err.message)!=-1){
            result.setMessage(err.message);
        }else{
            result.setMessage('Error Occured during signup');
        }
        await transactionSession.abortTransaction();
        res.status(400).json({
            success:false,
            message : result.getMessage(),
        });
    }finally{
        transactionSession.endSession();
    }
}
async function asyncFileUpload(sellerObj,file){
    logger.info('Inside asyncFileUpload Method !!!');
    try{
        const result = await fileUpload.uploadFilesToCloudinary(sellerObj,file,'seller');
        sellerObj.storeDetails.logoDetails.storeLogo = result[0].url;
        sellerObj.storeDetails.logoDetails.storeLogoPID = result[0].public_id;
        await sellerObj.save();
        logger.debug('Successfully Saved Images for user');
    }catch(err){
        logger.error('Error Occoured in asyncFileUpload Method !!!');
        logger.error(err);
        logger.debug('Since error occoured within asyncFileUploadMethod, deleting uploaded file');
        await cloudinary.api.delete_resources(sellerObj.storeDetails.logoDetails.storeLogoPID);
        logger.debug('Deleted file Successfully !!!');
    }
}