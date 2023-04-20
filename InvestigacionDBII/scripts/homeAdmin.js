
// Session storage
const username = sessionStorage.getItem("username");

//Calendar
let daySelected = null;
let daysList;

const currentDate = document.querySelector(".current-date");
daysTag = document.querySelector(".days");
prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();

let availableBeforeFlag = false;
let bookedBeforeFlag = false;


let datesAvailable = [];
let datesBooked = [];
datesBooked.push(new Date (2023,5,15));

const dateAvailable = new Date (2023,5,15);



const months = ["January", "February" ,"March", "April", "May", "June", "July",
"August", "September", "October", "November", "December"];
// End Calendar

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
        
        isToday = i === date.getDate() && currMonth === new Date().getMonth()
        && currYear === new Date().getFullYear() ? "active" : "";
        if (isToday != "active"){
            //isToday = i === dateAvailable.getDate() && currMonth + 1 === dateAvailable.getMonth()
            //&& currYear === dateAvailable.getFullYear() ? "available" : "";
            for (let j = 0; j < datesAvailable.length; j++) {
                if((datesAvailable[j].getDate() == i) && (datesAvailable[j].getMonth() == currMonth + 1) &&
                 (datesAvailable[j].getFullYear() == currYear)){
                    isToday = "available";
                }
            }
            if(isToday != "available"){
                for (let j = 0; j < datesBooked.length; j++) {
                    if((datesBooked[j].getDate() == i) && (datesBooked[j].getMonth() == currMonth + 1) &&
                     (datesBooked[j].getFullYear() == currYear)){
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
            }
            else if (day.classList.contains("available")){
                day.classList.remove("available");
                daySelected = day.textContent;
                day.classList.add("selected");

                availableBeforeFlag = true;
            }
            else if (day.classList.contains("booked")){
                day.classList.remove("booked");
                daySelected = day.textContent;
                day.classList.add("selected");

                bookedBeforeFlag = true;
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

function buttonSelected(){
    for (let i = 0; i < daysList.length; i++) {
        if(daysList[i].classList.contains("selected") && !daysList[i].classList.contains("booked") && !daysList[i].classList.contains("available")){
            console.log( daysList[i].textContent, currMonth + 1, currYear);
        }
        
    }
}

homeAdmin();