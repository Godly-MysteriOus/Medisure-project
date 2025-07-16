const axios = require('axios');
const credential = require('../../config');
const apiKey = credential.emailAPIKey;
const path = require('path');
const projectRoot = path.resolve(__dirname, '../');
const filePathRelativeToRoot = path.relative(projectRoot, __filename);
const Logger = require('../Logger/logger')(filePathRelativeToRoot);

exports.sendMail = (emailId,emailTemplate,html)=>{
    Logger.debug('Inside sendMail method!!!');
    Logger.debug('Sending mail to '+emailId);
    const emailData = {
        sender: { email: 'singhrajputjayant8@gmail.com', name: 'Medisure' },  // Replace with your sender details
        to: [{ email: emailId }],  // Replace with recipient's email
        subject: emailTemplate.emailSubject,
        textContent: emailTemplate.textContent,
        htmlContent: html,
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