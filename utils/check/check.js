const {check} = require('express-validator');
const fileConstants = require('../FileConstants');
const regexPatterns = require('../Regex');
exports.emailValidation = (email)=>{
    return check(email).custom(val=>{
        const emailRegex = regexPatterns.email_pattern;
        if(!emailRegex.test(val)){
            throw new Error(fileConstants.INVALID_EMAIL_PATTERN);
        }
        return true;
    });
};

exports.mobileNumberValidation = (mobileNo)=>{
    return check(mobileNo).custom(val=>{
        if(!regexPatterns.mobile_no_pattern.test(val)){
            throw new Error(fileConstants.INVALID_MOBILE_NUMBER);
        }
        return true;
    })
};

exports.basicMessageValidation = (userMessage)=>{
    return check(userMessage).custom(val=>{
        if(val.length<30){
            throw new Error('Message should be atleast 50 characters long');
        }
        return true;
    });
}

exports.passwordValidation = (password)=>{
    return check(password).custom(val=>{
        if(val.length<12){
            throw new Error('Password should be minimum 12 characters long');
        }else if(!(/[0-9]/.test(val))){
            throw new Error('Password must contain a number');
        }else if(!(/[a-z]/.test(val))){
            throw new Error('Password must contain a lowercase letter');
        }else if(!(/[A-Z]/.test(val))){
            throw new Error('Password must contain a uppercase letter');
        }
        return true;
    });
}