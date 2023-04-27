async function SignInUser(){
    const idCardPatient = document.getElementById('txtIdCard').value;
    
 
    const response = await fetch('/getUser',{
        method: "POST",
        body: JSON.stringify({idCard: idCardPatient}),
        headers: {
            "Content-Type": "application/json",
        },
    })

    let responseJason = await response.json();
    let isUser = responseJason.isUser;
    let getUser = responseJason.res;
    
    if (isUser){
        activeUser(getUser[0].identificationCard,getUser[0].fistNameName,getUser[0].fistSurname,getUser[0].birthDate);
        window.location.href ="/HomeUser";
    }
    else{
        document.getElementById('msgError').textContent = "Invalid user, try again";
        const toast = document.querySelector('.toast');
        const viewToast = new bootstrap.Toast(toast);
        viewToast.show();
    }
 }