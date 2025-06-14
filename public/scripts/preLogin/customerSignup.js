const passwordViewImage = document.querySelector('.passwordViewImage');
const rePasswordViewImage = document.querySelector('.rePasswordViewImage');
const customerMobileNumber = document.querySelector('.customerMobileNumber');
const customerName = document.querySelector('.customerName');

customerName.addEventListener('blur',()=>{
    const nameRegex = /^[a-zA-Z ]+$/;
    if(!nameRegex.test(customerName.value)){
        messageDisplayAndHide('Invalid Name String');
    }
})

passwordViewImage.addEventListener('click',()=>{
    if(passwordViewImage.getAttribute('src').includes('view.png')){
        passwordViewImage.setAttribute('src','/images/hide.png');
        document.querySelector('.customerPassword').setAttribute('type','text');
    }else{
        passwordViewImage.setAttribute('src','/images/view.png');
        document.querySelector('.customerPassword').setAttribute('type','password');
    }
});
rePasswordViewImage.addEventListener('click',()=>{
    if(rePasswordViewImage.getAttribute('src').includes('view.png')){
        rePasswordViewImage.setAttribute('src','/images/hide.png');
        document.querySelector('.customerRePassword').setAttribute('type','text');
    }else{
        rePasswordViewImage.setAttribute('src','/images/view.png');
        document.querySelector('.customerRePassword').setAttribute('type','password');
    }
});
customerMobileNumber.addEventListener('input',()=>{
    if(customerMobileNumber.value.length>10){
        customerMobileNumber.value = String(customerMobileNumber.value).substr(0,10);
    }
});