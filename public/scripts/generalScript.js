async function getCsrfToken(){
    const response = await fetch(url+'csrf-token',{
        method: 'GET',
    });
    const result = await response.json();
    return result.csrfToken;
};

function messageDisplayAndHide(responseMessage){
    message.classList.remove('messageHidden');
    message.textContent = responseMessage;
    setTimeout(()=>{
        message.classList.add('messageHidden');
    },3000);
};