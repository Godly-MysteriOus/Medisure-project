
const verificationPopupWrapperContainer = document.querySelector('.verificationPopupWrapperContainer');
const regenerateOTPBtn = document.querySelector('.regenerateOTPBtn');
const verifyOnClick = 'verifyOnClick';
const crossBtn = document.querySelector('.crossBtn');
const emailOTPInput = document.querySelector('.emailOTPInput');
const verifyBtn = document.querySelector('.verifyBtn');


regenerateOTPBtn.addEventListener('click',async(e)=>{
    if(!emailPatternValidation()){
        messageDisplayAndHide('Invalid Email Pattern');
        return;
    }
    const csrfToken = await getCsrfToken();
    const request = await fetch(url+'common/generate-OTP',{
        signal:AbortSignal.timeout(5000),
        method:'POST',
        headers:{'Content-Type':'application/json',
            'CSRF-Token':csrfToken,
        },
        body:JSON.stringify({
            emailId : emailIdToVerify.value,
        }),
    });
    const response = await request.json();
    if(request.status==429){
        window.location.href = url+response.redirectTo;
    }else{
        messageDisplayAndHide(response.message);
    }
    let time = 120;
    const interval = setInterval(()=>{
        if(time==0){
            regenerateOTPBtn.textContent = `Regenerate OTP`;
            regenerateOTPBtn.removeAttribute('disabled');
            clearInterval(interval);
        }else{
            if(time/60>=1){
                regenerateOTPBtn.textContent = `Retry in ${Math.floor(time/60)}m ${time%60}s`;
            }else{
                regenerateOTPBtn.textContent = `Retry in ${time%60}s`;
            }
            regenerateOTPBtn.setAttribute('disabled',true);
        }
        time--;   
    },1000)
});
crossBtn.addEventListener('click',()=>{
    emailOTPInput.value = '';
    hideVerificationPopUp();
});
function showVerificationPopUp(){
    verificationPopupWrapperContainer.classList.remove(verifyOnClick);
}
function hideVerificationPopUp(){
    verificationPopupWrapperContainer.classList.add(verifyOnClick);
}

verifyBtn.addEventListener('click',async(e)=>{
    const csrfToken = await getCsrfToken();
    const request = await fetch(url+'common/verify-OTP',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,
        },
        body:JSON.stringify({
            otp: emailOTPInput.value.trim(),
        }),
        signal:AbortSignal.timeout(5000),
    });
    const response = await request.json();
    if(response.success){
        setTimeout(()=>{
            emailOTPInput.value = '';
            emailSubmitButton.textContent = 'Verified';
            emailSubmitButton.setAttribute('disabled',true);
            emailIdToVerify.setAttribute('disabled',true);
            hideVerificationPopUp();
        },2500);
    }
    messageDisplayAndHide(response.message);
});