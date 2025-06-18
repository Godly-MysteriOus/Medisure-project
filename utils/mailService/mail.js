const axios = require('axios');
const credential = require('../../config');
const apiKey = credential.emailAPIKey;
const path = require('path');
const fileName = path.basename(__filename);
const dirName = path.join(__dirname).split(/medisure[\\/]/)[1];
const logger = require('../utils/Logger/logger')(`${dirName}\\${fileName}`);
exports.sendMail = (emailId,otp)=>{
    Logger.debug('Inside sendMail method!!!');
    Logger.debug('Sending mail to '+emailId);
    const emailData = {
        sender: { email: 'singhrajputjayant8@gmail.com', name: 'Medisure' },  // Replace with your sender details
        to: [{ email: emailId }],  // Replace with recipient's email
        subject: 'Medisure',
        textContent: 'Medisure - Registration OTP',
        htmlContent: 
        `<html>
            <body>
                <h1>Hi User!</h1>
                <p>Your One Time Verification code is <h1>${otp}</h1></p>
                <br><br>
                <h3>This OTP is valid for 5 minutes only, If </h3>
                <br><br> 
                <p>If you didn't sign up on Medisure, Please ignore this message.</p>
            </body>
        </html>`,
    };
    return axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
    })
    .then((response) => {
        Logger.debug('Email sent successfully: MessageId :'+ response.data.messageId);
        return true;
    })
    .catch((error) => {
        Logger.error('Error sending email\n'+error.response ? error.response.data : error.message);
        Logger.error(error.stack);
        return false;
    });
}