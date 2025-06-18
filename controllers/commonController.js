
const {validationResult} = require('express-validator');
const path = require('path');
const fileName = path.basename(__filename);
const dirName = path.dirname(__filename).split(/medisure[\\/]/)[1];
const logger = require('../utils/Logger/logger')(`${dirName}\\${fileName}`);
const newsLetterDB = require('../models/newsLetter');
const userQueriesDB = require('../models/userQueries');
const mailService = require('../utils/mailService/mail');
const mongoose = require('mongoose');
const Result = require('../classes/result');

exports.postSubscriptionToNewsLetter = async(req,res,next)=>{ 
    const result = new Result();
    logger.info('Inside postSubscriptionToNewsLetter method!!!');
    const error = validationResult(req);
    const {email} = req.body;
    if(!error.isEmpty()){
        logger.debug('Errors found while validating inputs.',error.array());
        return res.status(400).json({
            success:false,
            message: error.array()[0].msg,
        });
    }
    const transactionSession = await mongoose.startSession();
    try{
        transactionSession.startTransaction();
        const isAlreadySubscribed = await newsLetterDB.findOne({emailId:email});
        if(isAlreadySubscribed){
            logger.debug('Email Id already in subscription list');
            result.setSuccess(false);
            result.setMessage('Already Subscribed');
        }else{
            const saveForSubscription = await newsLetterDB.create([{emailId:email}],{session:transactionSession});
            if(!saveForSubscription){
                logger.debug('Error creating entry to the database for news Letter subscription');
                throw new Error('Error subscribing to news letter');
            }else{
                result.setSuccess(true);
                result.setMessage('Successfully Subscribed.');
            }
        }
        await transactionSession.commitTransaction();
        await transactionSession.endSession();
        return res.status(200).json({
            success:result.getSuccess(),
            message:result.getMessage(),
        });
    }catch(e){
        transactionSession.abortTransaction();
        transactionSession.endSession();
        let message = '';
        if(e.message=='Error subscribing to news letter'){
            message = e.message;
        }else{
            message = 'Error occoured, please try again!';
        };
        logger.debug('Error occoured while subscribing to news letter: '+message);
        logger.error(e.stack);
        return res.status(400).json({
            success:false,
            message:message,
        });
    }
}
function IndianStandardTime(){
    logger.info('Inside IndianStandardTime method!!!');
    const nowUTC = new Date();
    let nowIST;
    if(nowUTC.toString().includes('Indian Standard Time')){
        nowIST = nowUTC;
    }else{
        nowIST = new Date(nowUTC.getTime()+(5.5*60*60*1000));
    }
    return nowIST;
}
exports.postUserQueries = async(req,res,next)=>{
    logger.info('Inside commonController file,postUserQueries method !!!');
    const {emailId,mobileNo,message} = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        logger.error('Validation Error in postUserQueries method !',error.array());
        return res.status(400).json({
            success:false,
            message : error.array()[0].msg,
        });
    }
    const transactionSession = await mongoose.startSession();
    try{
        transactionSession.startTransaction();
        const isSaved = userQueriesDB.create([{emailId:emailId,mobileNo:mobileNo,message:message,raisedTime:IndianStandardTime(),status:'NEW'}],{session:transactionSession});
        if(!isSaved){
            logger.debug('Raising Request Failed, error saving data into the database');
            throw new Error('Raising Request Failed');
        }
        await transactionSession.commitTransaction();
        await transactionSession.endSession();
        logger.info('Raised Request Successfully');
        return res.status(201).json({
            success:true,
            message : 'Query Raised Successfully',
        });
    }catch(err){
        await transactionSession.abortTransaction();
        await transactionSession.endSession();
        let message = '';
        if(err.message=='Raising Request Failed'){
            message = err.message;
        }else{
            message = 'Error Occoured while raising request';
        };
        logger.debug('Error in postUserQueries method !!! message : '+err.message);
        logger.debug(err.stack);
        res.status(400).json({
            success:false,
            message:message,
        });
    }
}
let saveSession=(session)=> {
    return new Promise((resolve, reject) => {
        session.save(err => {
            if (err) {
                reject(new Error('Failed to save session'));
            } else {
                resolve(true);
            }
        });
    });
}

exports.postEmailOTPGeneration = async(req,res,next)=>{
    // Generating a 5 digit number
    logger.debug('Inside postEmailOTPGeneration method');
    const OTP = String(Math.floor(Math.random()*1000000000)).replaceAll('0','').slice(0,5);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        logger.error('Validation Errors inside postEmailOTPGeneration method !',errors.array());
        res.status(400).json({
            success:false,
            message : errors.array()[0],
        });
    }
    const {emailId} = req.body;
    try{
        req.session.emailId = emailId;
        req.session.OTP = Number(OTP);
        req.session.OTPExpirationTime = new Date(Date.now() + 5 * 60 * 1000);
        req.session.isLoggedIn = false;
       await saveSession(req.session);
       logger.debug('OTP generated and stored into session successfully');
       const mailResult = await mailService.sendMail(emailId,Number(OTP));
       if(mailResult){
            logger.debug('Mail Send Successfully');
           return res.status(200).json({
               success:true,
               message:'OTP Sent Successfully!',
           });
       }else{
            logger.debug('Error Sending mail');
            return res.status(400).json({
                success:false,
                message:'Could not send OTP, Try again later',
            });
       }
    }catch(e){
        logger.error('Error inside postEmailOTPGeneration method !!!',e);
        return res.status(400).json({
            success:false,
            message: 'Error Generating OTP',
        });
    }
};

exports.emailOTPVerification = (req,res,next)=>{
    logger.info('Inside emailOTPVerification method !!!');
    const result = new Result();
    const {otp} = req.body;
    try{
        const nowDate = new Date();
        logger.debug('Checking whether OTP is expired or not');
        if(req.session?.OTPExpirationTime > nowDate){
            logger.debug('OTP didn\'t crossed expiration time');
            if(req.session?.OTP == otp){
                delete req.session.OTP;
                delete req.session.OTPExpirationTime;
                logger.debug('Email OTP Verified Successfully');
                result.setSuccess(true);
                result.setMessage('Verified Email Successfully');
            }else{
                logger.debug('Wrong OTP');
                result.setSuccess(false);
                result.setMessage('Invalid OTP');
            }
        }else{
            logger.debug('Email OTP Expired');
            result.setSuccess(false);
            result.setMessage('Email OTP Expired, Regenerate OTP');
        }
        logger.debug('Returning result, result: '+result.getMessage()+" success: "+result.getSuccess());
        if(result.getSuccess()==false){
            res.status(400).json({
                success:result.getSuccess(),
                message:result.getMessage(),
            });
        }else{
            res.status(200).json({
                success:result.getSuccess(),
                message : result.getMessage(),
            });
        }
    }catch(err){
        logger.error('Error inside emailOTPVerification method!!!'+err);
        return res.status(400).json({
            success:false,
            message: 'Error Verifying OTP, Try again later',
        });
    }
};