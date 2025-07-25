const sellerName = document.querySelector('.sellerName');
const sellerPassword = document.querySelector('.sellerPassword');
const sellerRePassword = document.querySelector('.sellerRePassword');
const sellerMobileNumber = document.querySelector('.sellerMobileNumber');
const storeName = document.querySelector('.storeName');
const drugLicenseNumber = document.querySelector('.drugLicenseNumber');
const gstRegistrationNumber = document.querySelector('.gstRegistrationNumber');
const fssaiLicenseNumber = document.querySelector('.fssaiLicenseNumber');
const storeLogo = document.querySelector('.storeLogo');
const storeAddress = document.querySelector('.storeAddress');
const pincode = document.querySelector('.pincode');
const storeCity = document.querySelector('.storeCity');
const storeState = document.querySelector('.storeState');
const passwordViewImage = document.querySelector('.passwordViewImage');
const rePasswordViewImage = document.querySelector('.rePasswordViewImage');

passwordViewImage.addEventListener('click',()=>{
    if(passwordViewImage.getAttribute('src').includes('view.png')){
        passwordViewImage.setAttribute('src','/images/hide.png');
        sellerPassword.setAttribute('type','text');
    }else{
        passwordViewImage.setAttribute('src','/images/view.png');
        sellerPassword.setAttribute('type','password');
    }
});
rePasswordViewImage.addEventListener('click',()=>{
    if(rePasswordViewImage.getAttribute('src').includes('view.png')){
        rePasswordViewImage.setAttribute('src','/images/hide.png');
        sellerRePassword.setAttribute('type','text');
    }else{
        rePasswordViewImage.setAttribute('src','/images/view.png');
        sellerRePassword.setAttribute('type','password');
    }
});
function nameValidation(val,msg){
    const regex = /^[a-zA-Z\s]+$/;
    if(!regex.test(val.trim())){
        messageDisplayAndHide(msg);
        return;
    }
};
function mobileNumberValidation(){
    const regex = /^[1-9][0-9]{9}$/;
    if(!regex.test(sellerMobileNumber.value.trim())){
        messageDisplayAndHide('Please enter valid mobile number');
        return;
    }
};
function passwordValidation(){
    const r1 = /[0-9]+/;
    const r2 = /[a-z]+/;
    const r3 = /[A-Z]+/;
    const val = sellerPassword.value;
    if(val.length<12){
        messageDisplayAndHide('Password should be atleast 12 characters long');
        return;
    }else if(!r1.test(val)){
        messageDisplayAndHide('Passsword should contain a number');
        return;
    }else if(!r2.test(val)){
        messageDisplayAndHide('Password must contain a lowercase letter');
        return;
    }else if(!r3.test(val)){
        messageDisplayAndHide('Password must contain an uppercase letter');
        return;
    }
};
function confirmPasswordValidation(){
    if(sellerRePassword.val!=sellerPassword.val){
        messageDisplayAndHide('Password and Confirm password must be same');
        return;
    }
}
function validateDrugLicenseNumber() {
    const dlNumber = drugLicenseNumber.value;
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

  return (
    oldFormat.test(dlNumber) ||
    newStateFormat.test(dlNumber) ||
    mfgFormat.test(dlNumber) ||
    cosmeticsFormat.test(dlNumber) ||
    medDeviceFormat.test(dlNumber)
  );
}
function gstValidation(){
    const gstRegex = /^([0][1-9]|[1-3][0-9])[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][Z][A-Z0-9]$/;
    if(!gstRegex.test(gstRegistrationNumber.value)){
        messageDisplayAndHide('Invalid GST Number');
        return;
    }
};
function fssaiValidation(){
    const fssaiRegex = /^[1-2]([0][1-9]|[1-2][0-9]|3[0-5])[0-9]{2}[0-9]{2}[0-9]{7}$/;
    if(!fssaiRegex.test(fssaiLicenseNumber.value)){
        messageDisplayAndHide('Invalid FSSAI Number');
        return;
    }
};
pincode.addEventListener('input',async()=>{
    if(pincode.value.length==6){
        const csrfToken = await getCsrfToken();
        const request = await fetch(url+`common/pincode-location`,{
            method:'POST',
            headers:{'Content-Type':'application/json','CSRF-Token':csrfToken},
            body: JSON.stringify({
                pincode : pincode.value,
            }),
            signal: AbortSignal.timeout(5000),
        });
        const response = await request.json();
        if(response.success){
            const {state,city} = response.data;
            storeCity.value = city;
            storeState.value = state;
        }else{
            messageDisplayAndHide(response.message);
        }
    }else if(pincode.value.length>6){
        pincode.value = pincode.value.substr(0,6);
    }else{
        storeCity.value = '';
        storeState.value = '';
    }
})
sellerName.addEventListener('blur',()=>{
    nameValidation(sellerName.value,'Invalid Seller Name Format');
});
sellerPassword.addEventListener('blur',()=>{
    passwordValidation();
});
sellerRePassword.addEventListener('blur',()=>{
    confirmPasswordValidation();
});
sellerMobileNumber.addEventListener('blur',()=>{
    mobileNumberValidation();
});

storeName.addEventListener('blur',()=>{
    nameValidation(storeName.value,'Invalid Store Name Format');
});
drugLicenseNumber.addEventListener('blur',()=>{
    validateDrugLicenseNumber();
});
gstRegistrationNumber.addEventListener('blur',()=>{
    gstValidation();
});
fssaiLicenseNumber.addEventListener('blur',()=>{
    fssaiValidation();
});

registrationFormSubmitBtn.addEventListener('click',async(e)=>{
    nameValidation(sellerName.value,'Invalid Seller Name Format');
    passwordValidation();
    confirmPasswordValidation();
    mobileNumberValidation();
    nameValidation(storeName.value,'Invalid Store Name Format');
    validateDrugLicenseNumber();
    gstValidation();
    fssaiValidation();
    if(pincode.value.trim().length!=6){
        messageDisplayAndHide('Invalid Pincode');
        return;
    };
    if(!emailPatternValidation()){
        messageDisplayAndHide('Invalid Email Pattern');
        return;
    }
    const formData = new FormData();
    formData.append('sellerName',sellerName.value);
    formData.append('sellerEmail',emailIdToVerify.value);
    formData.append('sellerPassword',sellerPassword.value);
    formData.append('sellerMobileNumber',sellerMobileNumber.value);
    formData.append('storeName',storeName.value);
    formData.append('drugLicenseNumber',drugLicenseNumber.value);
    formData.append('gstNumber',gstRegistrationNumber.value);
    formData.append('fssaiNumber',fssaiLicenseNumber.value);
    formData.append('storeAddress',storeAddress.value);
    formData.append('storePincode',pincode.value);
    formData.append('storeLogo',storeLogo.files[0]);
    const csrfToken = await getCsrfToken();
    registrationFormSubmitBtn.setAttribute('disabled',true);
    const request = await fetch(url+'signup/seller',{
        method: 'POST',
        body : formData,
        headers: {'CSRF-Token':csrfToken},
        signal: AbortSignal.timeout(10000),
    });
    const response = await request.json();
    registrationFormSubmitBtn.removeAttribute('disabled');
    messageDisplayAndHide(response.message);
    if(response.success){
        sellerName.value = '';
        emailIdToVerify.value = '';
        sellerPassword.value = '';
        sellerRePassword.value = '';
        sellerMobileNumber.value = '';
        storeName.value = '';
        drugLicenseNumber.value = '';
        gstRegistrationNumber.value = '';
        fssaiLicenseNumber.value = '';
        storeLogo.value = '';
        storeAddress.value = '';
        pincode.value = '';
        storeState.value = '';
        storeCity.value = '';
        const timer = setTimeout(()=>{
            window.location.href = url+'login';
            clearTimeout(timer);
        },2500);
    }
});