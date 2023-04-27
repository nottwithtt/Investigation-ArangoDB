const params = new URLSearchParams(window.location.search);
const categoryArea = params.get("category");

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
// End Calendar

//ComboBox
const comboBox = document.getElementById("comboAreaAppointment");
let optionSelected = "None";
//End ComboBox

function appointment(){
    if(categoryArea == "Odontology"){
        document.getElementById('Title').textContent = "Odontology";
    }
    else if(categoryArea == "GeneralMedicine"){
        document.getElementById('Title').textContent = "General Medicine";
    }
    else if(categoryArea == "Ophthamology"){
        document.getElementById('Title').textContent = "Ophthamology";
    }
    else if(categoryArea == "Vaccination"){
        document.getElementById('Title').textContent = "Vaccination";
    }
    changeCalendarToArea();
    const txtName = document.getElementById('txtName');
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
                    if((datesBooked[j].getUTCDate() == i) && (datesBooked[j].getUTCMonth() == currMonth) &&
                     (datesBooked[j].getUTCFullYear() == currYear)){
                        isToday = "booked";
                    }
                }
            }
        }
        if(idAppointmentDB){
            liTag += `<li id="${idAppointmentDB}" class="${isToday}">${i}</li>`;
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
            }
            else if (day.classList.contains("booked") && !day.classList.contains("inactive")){
                day.classList.remove("booked");
                daySelected = day.textContent;
                day.classList.add("selected");

                bookedBeforeFlag = true;
                let button = document.getElementById('buttonModal');
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
    let idAppointmentDB;

    let posibleBook = false;

    for (let i = 0; i < daysList.length; i++) {
        if(daysList[i].classList.contains("selected") && availableBeforeFlag){
            date = new Date(currYear,currMonth, parseInt(daysList[i].textContent));
            posibleBook = true;
            idAppointmentDB = daysList[i].id;
        }
    }

    if (posibleBook){
        const res = await getAreas();

        if (categoryArea == "Odontology"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "Odontology"){
                    id = res[i]._key;
                }
            }
        }
        else if(categoryArea == "GeneralMedicine"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "General Medicine"){
                    id = res[i]._key;
                }
            }
        }
        else if (categoryArea == "Ophthamology"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "Ophthamology"){
                    id = res[i]._key;
                }
            }
        }
        else if(categoryArea == "Vaccination"){
            for (let i = 0; i < res.length; i++) {
                if (res[i].name == "Vaccination"){
                    id = res[i]._key;
                }
            }
        }


        await removeAvailableAppointment(idAppointmentDB);
        await createBookedAppointment(id,date,sessionStorage.getItem('idCard'));
        
        await onloadAvailableDates(id);
        await onloadBookedDates(id);

        renderCalendar();

        document.getElementById('msgError').textContent = "Appointment successfully booked";
        const toast = document.querySelector('.toast');
        const viewToast = new bootstrap.Toast(toast);
        viewToast.show();
    }
    else{
        document.getElementById('msgError').textContent = "Select an available appointment";
        const toast = document.querySelector('.toast');
        const viewToast = new bootstrap.Toast(toast);
        viewToast.show();
    }
    

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

async function createBookedAppointment(idAreaAppointment,dateAppointment,idPatient){
    const response = await fetch('/addBookedAppointment',{
        method: "POST",
        body: JSON.stringify({idArea: idAreaAppointment,
                              date: dateAppointment,
                              idPatient :idPatient}),
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

async function changeCalendarToArea(){
    let id = "";
    const res = await getAreas();


    if (categoryArea == "Odontology"){
        for (let i = 0; i < res.length; i++) {
            if (res[i].name == "Odontology"){
                id = res[i]._key;
            }
        }
    }
    else if(categoryArea == "GeneralMedicine"){
        for (let i = 0; i < res.length; i++) {
            if (res[i].name == "General Medicine"){
                id = res[i]._key;
            }
        }
    }
    else if (categoryArea == "Ophthamology"){
        for (let i = 0; i < res.length; i++) {
            if (res[i].name == "Ophthamology"){
                id = res[i]._key;
            }
        }
    }
    else if(categoryArea == "Vaccination"){
        for (let i = 0; i < res.length; i++) {
            if (res[i].name == "Vaccination"){
                id = res[i]._key;
            }
        }
    }

    await onloadAvailableDates(id);
    await onloadBookedDates(id);
    
    renderCalendar();
}

async function onloadAvailableDates(id){
    datesAvailable = [];

    let listRes = await getAvailableAppointmentsForArea(id);

    for (let i = 0; i < listRes.length; i++) {
        let date = new Date(listRes[i].date_appointment.slice(0,10));
        datesAvailable.push({"id": listRes[i]._key, "date" : new Date (date.getUTCFullYear(),date.getUTCMonth(), date.getUTCDate())});
    }
}

async function onloadBookedDates(id){
    datesBooked = [];

    let listRes = await getBookedAppointmentsForArea(id);
    

    for (let i = 0; i < listRes.length; i++) {
        let date = new Date(listRes[i].date.slice(0,10));
        datesBooked.push(new Date (date.getUTCFullYear(),date.getUTCMonth(), date.getUTCDate()));
    }
}

appointment();