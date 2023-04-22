
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
//datesBooked.push(new Date (2023,5,15));

//const dateAvailable = new Date (2023,5,15);

const months = ["January", "February" ,"March", "April", "May", "June", "July",
"August", "September", "October", "November", "December"];
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
        
        isToday = i === date.getUTCDate() && currMonth === new Date().getUTCMonth()
        && currYear === new Date().getUTCFullYear() ? "active" : "";
        if (isToday != "active"){
            //isToday = i === dateAvailable.getDate() && currMonth + 1 === dateAvailable.getMonth()
            //&& currYear === dateAvailable.getFullYear() ? "available" : "";
            for (let j = 0; j < datesAvailable.length; j++) {
                if((datesAvailable[j].getUTCDate() == i) && (datesAvailable[j].getUTCMonth()== currMonth) &&
                 (datesAvailable[j].getUTCFullYear() == currYear)){
                    isToday = "available";
                }
            }
            if(isToday != "available"){
                for (let j = 0; j < datesBooked.length; j++) {
                    console.log(datesBooked[j].getUTCDate() == i, datesBooked[j].getUTCMonth() == currMonth, datesBooked[j].getUTCFullYear() == currYear);
                    if((datesBooked[j].getUTCDate() == i) && (datesBooked[j].getUTCMonth() == currMonth) &&
                     (datesBooked[j].getUTCFullYear() == currYear)){
                        isToday = "booked";
                    }
                }
                
                /*
                isToday = i === dateAvailable.getDate() && currMonth + 1 === dateAvailable.getMonth()
                && currYear === dateAvailable.getFullYear() ? "booked" : "";*/
            }
        }
        liTag += `<li class="${isToday}">${i}</li>`;
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
            else if (day.classList.contains("available")){
                day.classList.remove("available");
                daySelected = day.textContent;
                day.classList.add("selected");

                availableBeforeFlag = true;
                
                let button = document.getElementById('buttonModal');
                button.textContent = "Delete Appointment";
            }
            else if (day.classList.contains("booked")){
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
        if (availableBeforeFlag && daysList[i].textContent == daySelected){
            availableBeforeFlag = false;
            daysList[i].classList.add("available");
        }
        else if (bookedBeforeFlag && daysList[i].textContent == daySelected){
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


    }
    renderCalendar();
}

async function onloadAvailableDates(id){
    datesAvailable = [];

    let listRes = await getAvailableAppointmentsForArea(id);

    for (let i = 0; i < listRes.length; i++) {
        let date = new Date(listRes[i].date_appointment.slice(0,10));
        datesAvailable.push(new Date (date.getUTCFullYear(),date.getUTCMonth(), date.getUTCDate()));
    }
}

async function onloadBookedDates(id){
    datesBooked = [];

    let listRes = await getBookedAppointmentsForArea(id);
    

    for (let i = 0; i < listRes.length; i++) {
        
        let date = new Date(listRes[i].date.slice(0,10));
        datesBooked.push(new Date (date.getUTCFullYear(),date.getUTCMonth(), date.getUTCDate() ));
    }
    console.log(datesBooked);
}

async function buttonModal(){
    let button = document.getElementById('buttonModal');

    if (button.textContent = "Create Appointment"){
        await createAppointment();
    }
    else{
        await deleteAppointment();
    }
}

async function deleteAppointment(){
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

       
        await deleteAppointment(id,date);
        
        //await removeAvailableAppointment(id,date);
        await onloadAvailableDates(id);

        renderCalendar();

    }

}

homeAdmin();