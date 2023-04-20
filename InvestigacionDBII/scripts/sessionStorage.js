
function activeUser(idCard,name,lastName,birthday){
    sessionStorage.setItem("idCard", idCard);
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("lastName", lastName);
    sessionStorage.setItem("birthday", birthday);
}

function activeAdmin(username){
    sessionStorage.setItem("username", username);
}

function inactive(){
    sessionStorage.clear();
}

