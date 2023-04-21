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
    areaName = await getAreaName(idArea);

    const appendTo = document.querySelector("#boxesContainer");

    const divPrincipal = document.createElement('div');
    divPrincipal.classList = "d-flex";
    divPrincipal.style = "border-style:solid; border-radius: 6px;  border-width: 0.05vw; margin-bottom: 1vw;";

    divPrincipal.innerHTML = `
        <div class="column" style="margin-right: 25vw;">
            <p style="margin-top:0.7vw;">${areaName}</p>
        </div>
        <div class="column justify-content-end" style=" margin-left: 28vw;;">
            <p class="text-end" style="margin-top:0.7vw;"> ${date}</p>
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
    console.log(appointments[0].date);
    
    for (let i = 0; i < appointments.length; i++) {
        id_Area = appointments[i].id_Area;
        date = appointments[i].date;
        createAppointmentBox(id_Area, date);
    }
    
}