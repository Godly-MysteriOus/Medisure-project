let i = 1;
const iMax = 3;
const iMin = 1;
const formPageHidden = 'formPageHidden';
const  buttonHidden = 'buttonHidden';
const formView = document.querySelectorAll('.formView');
const registrationFormNextBtn = document.querySelector('.registrationFormNextBtn');
const registrationFormBackBtn = document.querySelector('.registrationFormBackBtn');
const registrationFormSubmitBtn = document.querySelector('.registrationFormSubmitBtn');


registrationFormNextBtn.addEventListener('click',()=>{
    if(registrationFormNextBtn){
        i++;
        if(i<=iMax){
            formView.forEach(item=>item.classList.add(formPageHidden));
            document.querySelector(`.formView--${i}`).classList.remove(formPageHidden);
            if(i==iMax){
                registrationFormNextBtn.classList.add(buttonHidden);
                registrationFormSubmitBtn.classList.remove(buttonHidden);
            }
        }else{
            i--;
            registrationFormNextBtn.classList.add(buttonHidden);
            registrationFormSubmitBtn.classList.remove(buttonHidden);
        }
    }
});
registrationFormBackBtn.addEventListener('click',()=>{
    i--;
    if(i>=iMin){
        formView.forEach(item=>item.classList.add(formPageHidden));
        document.querySelector(`.formView--${i}`).classList.remove(formPageHidden);
        registrationFormNextBtn.classList.remove(buttonHidden);
        registrationFormSubmitBtn.classList.add(buttonHidden);
    }else{
        i++;
    }
});