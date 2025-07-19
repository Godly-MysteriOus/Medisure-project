module.exports = {
    loginInfoDB : require('./models/loginDetails'),
    userRegistrationDB : require('./models/customerDetails'),
    sellerRegistrationDB : require('./models/sellerDetails'),
    userQueriesDB : require('./models/userQueries'),
    newsLetterDB : require('./models/newsLetter'),
    emailTemplatesDB : require('./models/emailTemplates'),
    testCronDB : require('./models/testCron'),
    addressInfoComp : require('./models/utilities/AddressInfo'),
    auditColComp : require('./models/utilities/auditColumns'),
    medicineInfoComp : require('./models/utilities/MedicineInfo'),
}