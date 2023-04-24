const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

async function getAreaName(idArea){
    const response = await fetch('/getAreaById',{
        method: "POST",
        body: JSON.stringify({idArea: idArea}),
        headers: {
            "Content-Type": "application/json",
        },
    })
    let responseJason = await response.json();
    let name = responseJason.res[0].name;
    return name;
}

async function createAppointmentBox(idArea, date) {
    const areaName = await getAreaName(idArea);
    let dateAppointment = new Date(date.slice(0,10)); 
    
    const day = dateAppointment.getUTCDate();
    const month = dateAppointment.getMonth();
    const year = dateAppointment.getUTCFullYear();
    let daySuffix = "";

    let dateFormat = "";
    
    if (day == 1 || day == 21 || day == 31) {
        daySuffix = 'st';
    } else if (day == 2 || day == 22) {
        daySuffix = 'nd';
    } else if (day == 3 || day == 23) {
        daySuffix = 'rd';
    } else {
        daySuffix = 'th';
    }
    
    dateFormat = monthNames[month] + "," + day + daySuffix + " " + year;

    const appendTo = document.querySelector("#boxesContainer");

    const divPrincipal = document.createElement('div');
    divPrincipal.classList = "col-12 d-flex";
    divPrincipal.style = "border-style:solid; border-radius: 6px;  border-width: 0.05vw; margin-bottom: 1vw;";

    divPrincipal.innerHTML = `
        <div class="col-12 d-flex flex-row justify-content-between">
            <div>
                <p style="margin-top:0.7vw;">${areaName}</p>
            </div>
            <div>
                <p class="text-end" style="margin-top:0.7vw;"> ${dateFormat}</p>
            </div>
        </div>
    `
    appendTo.appendChild(divPrincipal);

}  


async function loadAppointments() {
    idPatient = sessionStorage.getItem("idCard");

    const response = await fetch('/getPatientAppointments',{
        method: "POST",
        body: JSON.stringify({idPatient: idPatient}),
        headers: {
            "Content-Type": "application/json",
        },
    })
    let responseJason = await response.json();
    let appointments = responseJason.res;
    
    for (let i = 0; i < appointments.length; i++) {
        id_Area = appointments[i].id_Area;
        date = appointments[i].date;
        createAppointmentBox(id_Area, date);
    }
    
}