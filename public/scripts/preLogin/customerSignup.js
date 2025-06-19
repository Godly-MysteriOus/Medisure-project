const passwordViewImage = document.querySelector('.passwordViewImage');
const rePasswordViewImage = document.querySelector('.rePasswordViewImage');
const customerMobileNumber = document.querySelector('.customerMobileNumber');
const customerName = document.querySelector('.customerName');
const customerPassword = document.querySelector('.customerPassword');
const customerRePassword = document.querySelector('.customerRePassword');
const customerSignUpSubmitBtn = document.querySelector('.customerSignUpSubmitBtn');
customerName.addEventListener('blur',()=>{
    const nameRegex = /^[a-zA-Z ]+$/;
    if(!nameRegex.test(customerName.value.trim())){
        messageDisplayAndHide('Invalid Name String');
    }
})

passwordViewImage.addEventListener('click',()=>{
    if(passwordViewImage.getAttribute('src').includes('view.png')){
        passwordViewImage.setAttribute('src','/images/hide.png');
        customerPassword.setAttribute('type','text');
    }else{
        passwordViewImage.setAttribute('src','/images/view.png');
        customerPassword.setAttribute('type','password');
    }
});
rePasswordViewImage.addEventListener('click',()=>{
    if(rePasswordViewImage.getAttribute('src').includes('view.png')){
        rePasswordViewImage.setAttribute('src','/images/hide.png');
        customerRePassword.setAttribute('type','text');
    }else{
        rePasswordViewImage.setAttribute('src','/images/view.png');
        customerRePassword.setAttribute('type','password');
    }
});
customerMobileNumber.addEventListener('input',()=>{
    if(customerMobileNumber.value.length>10){
        customerMobileNumber.value = String(customerMobileNumber.value).substr(0,10);
    }
});
function passwordValidation(){
    if(customerPassword.value.length<12){
        messageDisplayAndHide('Password should be minimum 12 characters long');
        return false;
    }else if(!(/[0-9]/.test(customerPassword.value))){
        messageDisplayAndHide('Password must contain a number');
        return false;
    }else if(!(/[a-z]/.test(customerPassword.value))){
        messageDisplayAndHide('Password must contain a lowercase letter');
        return false;
    }else if(!(/[A-Z]/.test(customerPassword.value))){
        messageDisplayAndHide('Password must contain a uppercase letter');
        return false;
    }
    return true;
};

customerPassword.addEventListener('blur',()=>{
    passwordValidation();
});

customerRePassword.addEventListener('blur',()=>{
    if(customerRePassword.value!= customerPassword.value && (customerRePassword.value.length>0 && customerPassword.value.length>0)){
        messageDisplayAndHide('Password and Confirm password should be same');
    }
});

customerSignUpSubmitBtn.addEventListener('click',async()=>{
    //name check
    const nameRegex = /^[a-zA-Z ]+$/;
    if(!nameRegex.test(customerName.value.trim())){
        messageDisplayAndHide('Invalid Name String');
        return;
    }
    // email Validation 
    const email_pattern = /^[a-z0-9]+([\.\-\_][a-z0-9]+)*@[a-z0-9]+(\.[a-z]{2,10})+$/;
    if(!email_pattern.test(emailIdToVerify.value)){
        messageDisplayAndHide('Invalid Email Id');
        return;
    }
    const pwValidation = passwordValidation();
    if(!pwValidation){
        return;
    }
    if(customerRePassword.value!= customerPassword.value && (customerRePassword.value.length>0 && customerPassword.value.length>0)){
        messageDisplayAndHide('Password and Confirm password should be same');
        return;
    }
    const csrfToken = await getCsrfToken();
    const request = await fetch(url+'signup/customer',{
        method:'PUT',
        headers:{
            'Content-Type': 'application/json',
            'CSRF-Token':csrfToken,
        },
        body:JSON.stringify({
            customerName: customerName.value,
            customerEmailId : emailIdToVerify.value,
            customerPassword : customerPassword.value,
            customerMobileNumber : customerMobileNumber.value,
        }),
        signal: AbortSignal.timeout(5000),
    });
    const response = await request.json();
    console.log(response);
    if(response.success){
        const timer = setTimeout(()=>{
            window.location.href = url+'login';
            clearTimeout(timer);
        },2500);
    }
    messageDisplayAndHide(response.message);
});