
const verificationPopupWrapperContainer = document.querySelector('.verificationPopupWrapperContainer');
const regenerateOTPBtn = document.querySelector('.regenerateOTPBtn');
const verifyOnClick = 'verifyOnClick';
const crossBtn = document.querySelector('.crossBtn');
const verifyBtn = document.querySelector('.verifyBtn');


regenerateOTPBtn.addEventListener('click',async(e)=>{
    messageDisplayAndHide('OTP Send Succesfully');
    let time = 70;
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
    hideVerificationPopUp();
});
verifyBtn.addEventListener('click',()=>{
    hideVerificationPopUp();
})
function showVerificationPopUp(){
    verificationPopupWrapperContainer.classList.remove(verifyOnClick);
}
function hideVerificationPopUp(){
    verificationPopupWrapperContainer.classList.add(verifyOnClick);
}