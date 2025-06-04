const email_pattern = /^[a-z0-9]+([\.\-\_][a-z0-9]+)*@[a-z0-9]+(\.[a-z]{2,10})+$/;
const customerEmail = document.querySelector('.newsLetterEmail');
const subscribeToNewsLetterButton = document.querySelector('.subscribeToNewsLetterButton');

function validateEmail(){
    const result = email_pattern.test(customerEmail.value);
    if(!result){
        messageDisplayAndHide('Invalid Email Pattern');
    }
    return result;
}
customerEmail.addEventListener('blur',()=>{
    validateEmail();
})
subscribeToNewsLetterButton.addEventListener('click',async(e)=>{
    const result = validateEmail();
    if(!result){
        return;
    }
    const csrfToken = await getCsrfToken();
    const request = await fetch(url+'common/subscribe-to-newsletter',{
        method: 'POST',
        headers : {'Content-Type':'application/json','CSRF-Token':csrfToken},
        body:JSON.stringify({
            email : customerEmail.value,
        }),
    });
    if(request.status==429){
        window.location.href = url+'429Error';
    }else{
        const response = await request.json();
        messageDisplayAndHide(response.message);
        if(response.success){
            subscribeToNewsLetterButton.textContent = 'Subscribed';
            subscribeToNewsLetterButton.setAttribute('disabled',true);
        }
    }
});
customerEmail.addEventListener('input',()=>{
    subscribeToNewsLetterButton.removeAttribute('disabled');
    subscribeToNewsLetterButton.textContent = 'Subscribe';
})
