
function homeUser(){
    const txtName = document.getElementById('nameLastNameRightCanvas');
    const txtIdCard = document.getElementById('txtIdCard');
    const txtBirthday = document.getElementById('txtBirthday');

    txtName.textContent = sessionStorage.getItem("name") + " " + sessionStorage.getItem("lastName");
    txtIdCard.textContent = sessionStorage.getItem("idCard");
    txtBirthday.value = sessionStorage.getItem("birthday").slice(0,10);
}

function signOut(){
    inactive();
    window.location.href = "/";
}

homeUser();