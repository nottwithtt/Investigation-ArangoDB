let daySelected = null;
let daysList;

const currentDate = document.querySelector(".current-date");
daysTag = document.querySelector(".days");
prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();



//const dateAvailable = new Date ('10-31-2023');
const dateAvailable = new Date (2023,5,15);

const months = ["January", "February" ,"March", "April", "May", "June", "July",
"August", "September", "October", "November", "December"];

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
            if(isToday != "available"){
                isToday = i === dateAvailable.getDate() && currMonth + 1 === dateAvailable.getMonth()
                && currYear === dateAvailable.getFullYear() ? "booked" : "";
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
            if (!day.classList.contains("inactive")){
                daySelected = day.textContent;
                day.classList.add("selected");
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
    }
}




