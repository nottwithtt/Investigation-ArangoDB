//Include express package
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const {Database} = require('arangojs')

const db = new Database({
    url:'http://127.0.0.1:8529',
    databaseName: 'DBInvestigation'
})


//Opens the server.
app.listen(3000,()=>{
    console.log('app listening in port 3000');
});

//Sets the server to serve html files.
app.set('view engine','html');

//Sets the server to get its resources from the specified directory.
app.use(express.static(__dirname+'/'));

//Sets the route for the signIn page
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/SignInUser.html');
});

app.get('/SignInAdmin',(req,res)=>{
    res.sendFile(__dirname+'/public/SignInAdmin.html');
});

app.get('/HomeAdmin',(req,res)=>{
    res.sendFile(__dirname+'/public/HomeAdmin.html');
});

app.get('/HomeUser',(req,res)=>{
    res.sendFile(__dirname+'/public/HomeUser.html');
});


db.useBasicAuth('root','2021069645');

db.listCollections()
  .then(collections => {
    console.log(`Found ${collections.length} collections.`);
  })
  .catch(err => {
    console.error(err);
});


// Insertar un usuario Paciente.
async function insertUserPatient(identificationCard,firstName, firstSurname, birthDate){
    let birthday = new Date(birthDate);
    await db.collection('users').save({
        identificationCard: identificationCard,
        fistNameName: firstName,
        fistSurname: firstSurname,
        birthDate: birthday,
    })
}
// insertUserPatient('118750560', 'Tamara', 'Rodríguez', Date("2020-08-29"));

async function deleteUserPatient(identificationCard){
    await db.collection('users').remove(identificationCard);
}

// se trae todos los usuarios/pacientes. :D
async function getUserPatient(){
    let collection = db.collection('users');
    let cursor = await db.query(
        aql`FOR doc in ${collection}
            RETURN doc`)
    let arrayU = await cursor.all();
    console.log(arrayU)
}

// getUserPatient();

//Function that encrypts a password.
function encryptPassword(password){
    const saltRounds = 10;
    var encrypted_password = bcrypt.hashSync(password, saltRounds);
    return encrypted_password;
}

// Insertar un usuario Administrator.
async function insertAdmin(username, password){
    await db.collection('admins').save({
        username: username,
        password: password,
    })
}

insertAdmin('nottwithtt', 'pepe');

// availableAppointment
// bookedAppointment

async function insertAvailableAppointment(idArea,date){
    await db.collection('availableAppointment').save({
        id_Area: idArea,
        date_appointment: new Date(date)
    })
}

async function deleteAvailableAppointment(idAppointment){
   await db.collection('availableAppointment').remove(idAppointment);
}

async function insertBookedAppointment(idArea,dateB,idPatient){
    await db.collection('bookedAppointment').save({
        id_Area: idArea,
        date: new Date(dateB),
        id_Patient: idPatient
    })
}
async function getAvailableAppointment(){
    let collection =  db.collection('availableAppointment');

    let cursor = await db.query(
        aql`FOR doc in ${collection}
        RETURN doc`)

    let array = await cursor.all();
    console.log(array)
}

async function getBookedAppointments(){
    let collection =  db.collection('bookedAppointment');
    let cursor = await db.query(
        aql`FOR doc in ${collection}
        RETURN doc`)
    let array = await cursor.all();
    console.log(array)
}

async function getbookedAppointmentPatient(idPatient){
    let collection =  db.collection('bookedAppointment');
    let cursor = await db.query(
        aql`FOR doc in ${collection}
            FILTER doc.id_Patient == ${idPatient}
            RETURN doc`)

    let array = await cursor.all();
    console.log(array)
}

getAvailableAppointment()