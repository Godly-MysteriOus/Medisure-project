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
exports.pincodeValidation = (pincode)=>{
    return check(pincode).custom(val=>{
        if(val.trim().length!=6){
            throw new Error('Pincode must be a 6 digit number');
        }
        return true;
    });
}
exports.nameValidation = (name,msg)=>{
    return check(name).custom(val=>{
        const regex = /^[a-zA-Z\s]+$/;
        if(!regex.test(val.trim())){
            throw new Error(msg);
        }
        return true;
    });
}
exports.drugLicenseNumberValidation = (number)=>{
    return check(number).custom(value=>{
        const val = value.trim();
        // Format 1: Old style - numeric e.g., 20-123456 or 20-12345678
        const oldFormat = /^\d{2}-\d{6,8}$/;

        // Format 2: New alphanumeric style e.g., UP6512345678910
        const newStateFormat = /^[A-Z]{2}\d{11,13}$/;

        // Format 3: Manufacturing license e.g., MFG-MH-2023-09
        const mfgFormat = /^MFG-[A-Z]{2}-\d{4}-\d{2}$/;

        // Format 4: Cosmetics license e.g., COS-UP2024-088
        const cosmeticsFormat = /^COS-[A-Z]{2}\d{4}-\d{3}$/;

        // Format 5: Medical device license e.g., MD-2023-UP009
        const medDeviceFormat = /^MD-\d{4}-[A-Z]{2}\d{3}$/;
        const result = oldFormat.test(val.trim()) || newStateFormat.test(val.trim()) || mfgFormat.test(val.trim()) || cosmeticsFormat.test(val.trim()) || medDeviceFormat.test(val.trim());
        if(!result){
            throw new Error('Invalid Drug License Number');
        }
        return true;
    });
}
exports.gstValidation = (number)=>{
    return check(number).custom(val=>{
        const gstRegex = /^([0][1-9]|[1-3][0-9])[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][Z][A-Z0-9]$/;
        if(!gstRegex.test(val.trim())){
            throw new Error('Invalid GST Number');
        }
        return true;
    })
}
exports.fssaiNumberValidation = (fssaiNumber)=>{
    return check(fssaiNumber).custom(val=>{
        const fssaiRegex = /^[1-2]([0][1-9]|[1-2][0-9]|3[0-5])[0-9]{2}[0-9]{2}[0-9]{7}$/;
        if(!fssaiRegex.test(val.trim())){
            throw new Error('Invalid FSSAI Number');
        }
        return true;
    });
}

exports.imageFileValidation = (file)=>{
    return check(file, `${file} File is required`).custom((value, { req }) => {
        if (!req.files){
            throw new Error(`${file} is required`);
        }; // Ensure file exists
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(req.files[0].mimetype)) {
            throw new Error("Only JPG, PNG, and JPEG files are allowed");
        }
        return true;
    });
};
exports.pdfFileValidation = (file)=>{
    return check(file, 'File is required').custom((value, { req }) => {
        if (!req.file){
            throw new Error(`File Required`);
        }; // Ensure file exists
        if (req.file.mimetype!="application/pdf") {
            throw new Error("Only PDF files are allowed");
        }
        return true;
    });
}