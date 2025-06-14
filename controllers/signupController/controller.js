exports.getCustomerSignupPage = (req,res,next)=>{
    return res.status(200).render('preLogin/customerSignup.ejs',{
        isLoggedIn:false,
        landedPage:'customerSignUpPage',
    });
};