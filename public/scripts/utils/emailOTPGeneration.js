const submitBtnHolder = document.querySelector('.submitBtnHolder');
    const emailSubmitButton = document.querySelector('.emailSubmitButton');
    const emailIdToVerify = document.querySelector('.emailIdToVerify');
    const emailResetBtn = document.querySelector('.emailResetBtn');
    // emailSubmitButton.style.color = 'gold';
    
    //Reset button to remove content
    emailResetBtn.addEventListener('click',()=>{
        emailIdToVerify.value = '';
        emailIdToVerify.removeAttribute('disabled');
        emailSubmitButton.removeAttribute('disabled');
        emailSubmitButton.textContent = 'Verify';
    });

    //function to test input data via regex pattern
    function emailPatternValidation(){
        const email_pattern = /^[a-z0-9]+([\.\-\_][a-z0-9]+)*@[a-z0-9]+(\.[a-z]{2,10})+$/;
        return email_pattern.test(emailIdToVerify.value)
    }

    emailIdToVerify.addEventListener('blur',()=>{
        if(!emailPatternValidation()){
            messageDisplayAndHide('Invalid Email Pattern');
        }
    });
    submitBtnHolder.addEventListener('click',async(e)=>{
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
                emailId : emailIdToVerify.value.trim(),
            }),
        });
        const response = await request.json();
        if(request.status==429){
            window.location.href = url+response.redirectTo;
        }else{
            messageDisplayAndHide(response.message);
            showVerificationPopUp();
        }
    });
       