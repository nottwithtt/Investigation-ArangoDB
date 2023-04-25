var toastElList = [].slice.call(document.querySelectorAll('.toast'));

// Session storage
const username = sessionStorage.getItem("username");

//Calendar
let daySelected = null;
let daysList;

const currentDate = document.querySelector(".current-date");
daysTag = document.querySelector(".days");
prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date();
let currYear = date.getUTCFullYear();
let currMonth = date.getUTCMonth();

let availableBeforeFlag = false;
let bookedBeforeFlag = false;


let datesAvailable = [];
let datesBooked = [];

const months = ["January", "February" ,"March", "April", "May", "June", "July",
"August", "September", "October", "November", "December"];

let flagNotAreaOnload = true;
// End Calendar

//ComboBox
const comboBox = document.getElementById("comboAreaAppointment");
let optionSelected = "None";
//End ComboBox

function homeAdmin(){
    let usernameAdmin = document.getElementById('userRightCanvas');
    usernameAdmin.textContent = username;
}

async function createPatient(){
    const identification = document.getElementById('idCard').value;
    const namePatient = document.getElementById('namePatient').value;
    const lastNamePatient = document.getElementById('lastNamePatient').value;
    const birthdayPatient = document.getElementById('birthdayPatient').value;

    if(identification && namePatient && lastNamePatient && birthdayPatient){
        const response = await fetch('/addPatient',{
            method: "POST",
            body: JSON.stringify({idCard: identification,
                                name: namePatient,
                                lastName: lastNamePatient,
                                birthday : birthdayPatient}),
            headers: {
                "Content-Type": "application/json",
            },
        })

        let responseJason = await response.json();

        document.getElementById('msgError2').textContent = "Successfully created";
        const viewToast = new bootstrap.Toast(toastElList[1]);
        viewToast.show();
    }
    else{
        document.getElementById('msgError2').textContent = "Invalid or not filled in fields, try again";
        const viewToast = new bootstrap.Toast(toastElList[1]);
        viewToast.show();
    }
    
}

function SignOut() {
    inactive();
    window.location.href ="/";
}


const renderCalendar = () => {
    let firstDayOfMonth = new Date(currYear, currMonth,1).getDay();
    let lastDateOfMonth = new Date(currYear, currMonth+1,0).getDate();
    let lastDayOfMonth = new Date(currYear, currMonth,lastDateOfMonth).getDay();
    let lastDateOfLastMonth = new Date(currYear, currMonth,0).getDate();
    let liTag = "";

    for (let i = firstDayOfMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        let isToday;
        let idAppointmentDB;
        
        isToday = i === date.getDate() && currMonth === new Date().getUTCMonth()
        && currYear === new Date().getUTCFullYear() ? "active" : "";
        if (isToday != "active"){
            for (let j = 0; j < datesAvailable.length; j++) {
                if((datesAvailable[j].date.getUTCDate() == i) && (datesAvailable[j].date.getUTCMonth()== currMonth) &&
                 (datesAvailable[j].date.getUTCFullYear() == currYear)){
                    isToday = "available";
                    idAppointmentDB = datesAvailable[j].id;
                }
            }
            if(isToday != "available"){
                for (let j = 0; j < datesBooked.length; j++) {
                    if((datesBooked[j].date.getUTCDate() == i) && (datesBooked[j].date.getUTCMonth() == currMonth) &&
                     (datesBooked[j].date.getUTCFullYear() == currYear)){
                        isToday = "booked";
                        idAppointmentDB = datesBooked[j].id;
                    }
                }
            }
        }
        if(idAppointmentDB){
            liTag += `<li id = ${idAppointmentDB} class="${isToday}">${i}</li>`;
        }
        else{
            liTag += `<li class="${isToday}">${i}</li>`;
        }
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
    }
    daysList = document.querySelectorAll(".days li");

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;


    daysList = document.querySelectorAll(".days li");
    daysList.forEach(day => {
        day.addEventListener("click",() =>{
            removeClassSelected();
            if (!day.classList.contains("inactive") && !day.classList.contains("booked") && !day.classList.contains("available")){
                daySelected = day.textContent;
                day.classList.add("selected");

                let button = document.getElementById('buttonModal');
                button.textContent = "Create Appointment";
            }
            else if (day.classList.contains("available") && !day.classList.contains("inactive")){
                day.classList.remove("available");
                daySelected = day.textContent;
                day.classList.add("selected");

                availableBeforeFlag = true;
                
                let button = document.getElementById('buttonModal');
                button.textContent = "Delete Appointment";
            }
            else if (day.classList.contains("booked") && !day.classList.contains("inactive")){
                day.classList.remove("booked");
                daySelected = day.textContent;
                day.classList.add("selected");

                bookedBeforeFlag = true;
                let button = document.getElementById('buttonModal');
                button.textContent = "Delete Appointment";
            }
        });
    });
}

renderCalendar();

prevNextIcon.forEach(icon => {
    icon.addEventListener("click",() =>{
        currMonth = icon.id === "prev" ? currMonth - 1: currMonth + 1;

        if(currMonth < 0 || currMonth > 11){
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        }
        else{
            date = new Date();
        }
        renderCalendar();
    });
});



function removeClassSelected(){

    for (let i = 0; i < daysList.length; i++) {
        daysList[i].classList.remove("selected");
        if (availableBeforeFlag && daysList[i].textContent == daySelected && !daysList[i].classList.contains("inactive")){
            availableBeforeFlag = false;
            daysList[i].classList.add("available");
        }
        else if (bookedBeforeFlag && daysList[i].textContent == daySelected && !daysList[i].classList.contains("inactive")){
            bookedBeforeFlag = false;
            daysList[i].classList.add("booked");
        }

    }
}



async function createAppointment(){
    let date;
    let id;

    for (let i = 0; i < daysList.length; i++) {
        if(daysList[i].classList.contains("selected") ){
            date = new Date(currYear,currMonth, parseInt(daysList[i].textContent));
        }
    }

    if (optionSelected != "None"){

        const res = await getAreas();

        if (optionSelected == "Odontology"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "Odontology"){
                    id = res[i]._key;
                }
            }
        }
        else if(optionSelected == "General Medicine"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "General Medicine"){
                    id = res[i]._key;
                }
            }
        }
        else if (optionSelected == "Ophthamology"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "Ophthamology"){
                    id = res[i]._key;
                }
            }
        }
        else if(optionSelected == "Vaccination"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "Vaccination"){
                    id = res[i]._key;
                }
            }
        }

       
        await createAvailableAppointment(id,date);
        
        //await removeAvailableAppointment(id,date);
        await onloadAvailableDates(id);
        await onloadBookedDates(id);

        renderCalendar();

    }
    

}

async function createAvailableAppointment(idAreaAppointment,dateAppointment){
    const response = await fetch('/addAvailableAppointment',{
        method: "POST",
        body: JSON.stringify({idArea: idAreaAppointment,
                              date: dateAppointment}),
        headers: {
            "Content-Type": "application/json",
        },
    })
    let responseJason = await response.json();

}

async function removeAvailableAppointment(idAppointment){

    const response = await fetch('/removeAvailableAppointment',{
        method: "POST",
        body: JSON.stringify({idAppointment: idAppointment}),
        headers: {
            "Content-Type": "application/json",
        },
    })
    let responseJason = await response.json();
}

async function removeBookedAppointment(idAppointment){

    const response = await fetch('/removeBookedAppointment',{
        method: "POST",
        body: JSON.stringify({idAppointment: idAppointment}),
        headers: {
            "Content-Type": "application/json",
        },
    })
    let responseJason = await response.json();
}

async function getAvailableAppointmentsForArea(idAreas){

    const response = await fetch('/getAvailablesAppointment',{
        method: "POST",
        body: JSON.stringify({idArea: idAreas}),
        headers: {
            "Content-Type": "application/json",
        },
    })
    let responseJason = await response.json();
    return responseJason.res;
}

async function getBookedAppointmentsForArea(idAreas){

    const response = await fetch('/getBookedAppointment',{
        method: "POST",
        body: JSON.stringify({idArea: idAreas}),
        headers: {
            "Content-Type": "application/json",
        },
    })
    let responseJason = await response.json();
    return responseJason.res;
}

async function getAreas(){
    const response = await fetch('/getAreas',{
        method: "POST",
        body: JSON.stringify({}),
        headers: {
            "Content-Type": "application/json",
        },
    })

    let responseJason = await response.json();
    return responseJason.res;
}

comboBox.addEventListener("change", function() {
    const valorSeleccionado = this.options[this.selectedIndex];
    optionSelected = valorSeleccionado.text;
});

async function changeCalendarToArea(){
    flagNotAreaOnload = false;

    let id;
    if(optionSelected != "None"){
        const res = await getAreas();

        if (optionSelected == "Odontology"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "Odontology"){
                    id = res[i]._key;
                }
            }
        }
        else if(optionSelected == "General Medicine"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "General Medicine"){
                    id = res[i]._key;
                }
            }
        }
        else if (optionSelected == "Ophthamology"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "Ophthamology"){
                    id = res[i]._key;
                }
            }
        }
        else if(optionSelected == "Vaccination"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "Vaccination"){
                    id = res[i]._key;
                }
            }
        }


        //datesAvailable = await getAvailableAppointmentsForArea(id);
        await onloadAvailableDates(id);
        await onloadBookedDates(id);

        
        renderCalendar();
        
        document.getElementById('msgError1').textContent = "Loaded correctly";
        const viewToast = new bootstrap.Toast(toastElList[0]);
        viewToast.show();
    }

}

async function onloadAvailableDates(id){

    datesAvailable = [];

    let listRes = await getAvailableAppointmentsForArea(id);

    for (let i = 0; i < listRes.length; i++) {
        let date = new Date(listRes[i].date_appointment.slice(0,10));
        datesAvailable.push({"id": listRes[i]._key, "date" : new Date (date.getUTCFullYear(),date.getUTCMonth(), date.getUTCDate())});
    }

    console.log(datesAvailable);
}

async function onloadBookedDates(id){
    datesBooked = [];

    let listRes = await getBookedAppointmentsForArea(id);
    

    for (let i = 0; i < listRes.length; i++) {
        let date = new Date(listRes[i].date.slice(0,10));
        datesBooked.push({"id": listRes[i]._key, "date" : new Date (date.getUTCFullYear(),date.getUTCMonth(), date.getUTCDate())});
    }
}

async function buttonModal(){
    let button = document.getElementById('buttonModal');

    if(comboBox.selectedIndex == 0){
        document.getElementById('msgError1').textContent = "Unselected appointment area";
        const viewToast = new bootstrap.Toast(toastElList[0]);
        viewToast.show();
    }
    else if(flagNotAreaOnload){
        document.getElementById('msgError1').textContent = "Click 'done' to load the appointment area";
        const viewToast = new bootstrap.Toast(toastElList[0]);
        viewToast.show();
    }
    else if(notSelectedDays()){
        document.getElementById('msgError1').textContent = "Select a specific day";
        const viewToast = new bootstrap.Toast(toastElList[0]);
        viewToast.show();
    }
    else{
        if (button.textContent == "Create Appointment"){
            await createAppointment();
            document.getElementById('msgError1').textContent = "Successfully created";
            const viewToast = new bootstrap.Toast(toastElList[0]);
            viewToast.show();
        }
        else{
            await deleteAppointment();
            document.getElementById('msgError1').textContent = "Successfully eliminated";
            const viewToast = new bootstrap.Toast(toastElList[0]);
            viewToast.show();
        }
    }

}

function notSelectedDays(){
    let flag = true;
    for (let i = 0; i < daysList.length; i++) {
        if(daysList[i].classList.contains('selected')){
            flag = false;
        }
    }
    return flag;
}

async function deleteAppointment(){
    let date;
    let id;
    let idAppointmentDB;

    for (let i = 0; i < daysList.length; i++) {
        if(daysList[i].classList.contains("selected") ){
            date = new Date(currYear,currMonth, parseInt(daysList[i].textContent));
            idAppointmentDB = daysList[i].id;
        }
    }

    if (optionSelected != "None"){

        const res = await getAreas();

        if (optionSelected == "Odontology"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "Odontology"){
                    id = res[i]._key;
                }
            }
        }
        else if(optionSelected == "General Medicine"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "General Medicine"){
                    id = res[i]._key;
                }
            }
        }
        else if (optionSelected == "Ophthamology"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "Ophthamology"){
                    id = res[i]._key;
                }
            }
        }
        else if(optionSelected == "Vaccination"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "Vaccination"){
                    id = res[i]._key;
                }
            }
        }

        if (availableBeforeFlag){
            await removeAvailableAppointment(idAppointmentDB);
            availableBeforeFlag = false;
        }
        else if (bookedBeforeFlag){
            await removeBookedAppointment(idAppointmentDB);
            bookedBeforeFlag = false;
        }
        
        await onloadAvailableDates(id);
        await onloadBookedDates(id);

        renderCalendar();

    }

}

homeAdmin();