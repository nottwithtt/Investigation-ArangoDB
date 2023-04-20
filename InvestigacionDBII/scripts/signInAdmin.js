async function SignInAdmin(){
    const username = document.getElementById('txtUsername').value;
    const password = document.getElementById('txtPassword').value;

    const response = await fetch('/getAdmin',{
        method: "POST",
        body: JSON.stringify({username: username,
                              password: password}),
        headers: {
            "Content-Type": "application/json",
        },
    })

    let responseJason = await response.json();
    let isUser = responseJason.isUser;
    let getUser = responseJason.res;

    if (isUser){
        activeAdmin(getUser[0].username);
        window.location.href ="/HomeAdmin";
    }
 }