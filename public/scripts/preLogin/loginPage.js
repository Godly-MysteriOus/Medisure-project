const customerSignUpSubmitBtn = document.querySelector('.customerSignUpSubmitBtn');
const loginEmailId = document.querySelector('.loginEmailId');
const loginMobileNo = document.querySelector('.loginMobileNo');
const loginPassword = document.querySelector('.loginPassword');
const passwordViewImage = document.querySelector('.passwordViewImage');
function emailPatternValidation(){
    const email_pattern = /^[a-z0-9]+([\.\-\_][a-z0-9]+)*@[a-z0-9]+(\.[a-z]{2,10})+$/;
    return email_pattern.test(loginEmailId.value);
}
function mobileNumberValidation(){
    const mobilePattern = /[1-9][0-9]{9}/;
    return mobilePattern.test(loginMobileNo.value);
}
function passwordValidation(){
    if(loginPassword.value.length<12){
        return false;
    }
    return true;
}

loginEmailId.addEventListener('blur',()=>{
    if(!emailPatternValidation()){
        messageDisplayAndHide('Invalid Email Pattern');
    }
});
loginMobileNo.addEventListener('blur',()=>{
    if(!mobileNumberValidation()){
        messageDisplayAndHide('Invalid Mobile Number Format');
    }
});
loginPassword.addEventListener('blur',(e)=>{
    console.log(e.target);
    if(!passwordValidation()){
        messageDisplayAndHide('Password should be minimum 12 characters long');
    }
})
customerSignUpSubmitBtn.addEventListener('click',async(e)=>{
    if(!emailPatternValidation()){
        messageDisplayAndHide('Invalid Email Pattern');
        return;
    }
    if(!mobileNumberValidation()){
        messageDisplayAndHide('Invalid Mobile Number Format');
        return;
    }
    if(!passwordValidation()){
        messageDisplayAndHide('Password should be minimum 12 characters long');
        return;
    }
    const csrfToken = await getCsrfToken();
    const request = await fetch(url+'login',{
        method:'POST',
        headers:{'Content-Type':'application/json','CSRF-Token':csrfToken},
        signal:AbortSignal.timeout(5000),
        body:JSON.stringify({
            emailId : loginEmailId.value,
            mobileNo : loginMobileNo.value,
            password : loginPassword.value,
        }),
    });
    const response = await request.json();
    if(response.success){
        if(response.roleId == 1){
            window.location.href = url+'customer/home-page';
        }else if(response.roleId == 2){
            window.location.href = url+'seller/home-page';
        }
    }else{
        messageDisplayAndHide(response.message);
    }
});



passwordViewImage.addEventListener('click',()=>{
    message.classList.add('messageHidden');
    if(passwordViewImage.getAttribute('src').includes('view.png')){
        passwordViewImage.setAttribute('src','/images/hide.png');
        loginPassword.setAttribute('type','text');
    }else{
        passwordViewImage.setAttribute('src','/images/view.png');
        loginPassword.setAttribute('type','password');
    }
});