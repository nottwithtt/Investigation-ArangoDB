//Include express package
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const {Database, aql} = require('arangojs');

const db = new Database({
    url:'http+tcp://127.0.0.1:8529',
    databaseName: 'DBInvestigation'
})

db.useBasicAuth('root','2021069645');

db.listCollections()
  .then(collections => {
    console.log(`Found ${collections.length} collections.`);
  })
  .catch(err => {
    console.error(err);
});

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

app.get('/Appointment',(req,res)=>{
    res.sendFile(__dirname+'/public/Appointment.html');
});


app.post('/getAdmin',bodyParser.json(),async(req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    let isUser = false;
    let getUser = await getAdmin(username,password);

    if(getUser.length != 0){
        isUser = true;
    }

    res.json({"res": getUser,"isUser": isUser});
})

app.post('/getUser',bodyParser.json(),async(req,res) => {
    let idCard = req.body.idCard;
    console.log(idCard);

    
    let isUser = false;
    let getUser = await getUserPatient(idCard);

    if(getUser.length != 0){
        isUser = true;
    }

    res.json({"res": getUser,"isUser": isUser});
})


app.post('/addPatient',bodyParser.json(),async(req,res) => {
    let idCard = req.body.idCard;
    let name = req.body.name;
    let lastName = req.body.lastName;
    let birthday = req.body.birthday;

    await insertUserPatient(idCard,name,lastName,birthday);

    res.json({});
})

app.post('/addAvailableAppointment',bodyParser.json(),async(req,res) => {
    let idArea = req.body.idArea;
    let date = req.body.date;

    await insertAvailableAppointment(idArea,date);

    res.json({});
})

app.post('/getAvailablesAppointment',bodyParser.json(),async(req,res) => {
    let idArea = req.body.idArea;

    let availableAppointments = await getAvailableAppointmentsForArea(idArea);

    res.json({"res": availableAppointments});
})

app.post('/removeAvailableAppointment',bodyParser.json(),async(req,res) => {
    let idAppointment = req.body.idAppointment;

    await deleteAvailableAppointment(idAppointment);

    res.json({});
})



app.post('/addAvailableAppointment',bodyParser.json(),async(req,res) => {
    let idArea = req.body.idArea;
    let date = req.body.date;
    let idPatient;

    await insertBookedAppointment(idArea,date,idPatient);

    res.json({});
})

app.post('/getBookedAppointment',bodyParser.json(),async(req,res) => {
    let idArea = req.body.idArea;

    let availableAppointments = await getBookedAppointmentsForArea(idArea);

    res.json({"res": availableAppointments});
})

app.post('/getAreas',bodyParser.json(),async(req,res) => {

    let arrayAreas = await getCategoriesArea();

    res.json({"res": arrayAreas});
})

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
async function getUserPatient(idCard){
    let collection = db.collection('users');
    let cursor = await db.query(
        aql`FOR doc in ${collection}
            FILTER doc.identificationCard == ${idCard}
            RETURN doc`)
    let arrayU = await cursor.all();
    return arrayU;
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

async function getAdmin(username,password){
    let collection = db.collection('admins');
    let cursor = await db.query(
        aql`FOR doc in ${collection}
            FILTER doc.username == ${username} && doc.password == ${password}
            RETURN doc`)
    let arrayU = await cursor.all();
    return arrayU;
}

//insertAdmin('nottwithtt', 'pepe');

// availableAppointment
// bookedAppointment

async function insertAvailableAppointment(idArea,date){
    await db.collection('availableAppointment').save({
        id_Area: idArea,
        date_appointment: new Date(date)
    })
}

/*
async function deleteAvailableAppointment(idAppointment){
   await db.collection('availableAppointment').remove(idAppointment);
}*/

async function deleteAvailableAppointment(idAppointment){
    let collection =  db.collection('availableAppointment');
    
    await db.query(
        aql`FOR doc in ${collection}
        FILTER doc._key == ${idAppointment}
        REMOVE doc in ${collection}`)
}

async function insertBookedAppointment(idArea,dateB,idPatient){
    await db.collection('bookedAppointment').save({
        id_Area: idArea,
        date: new Date(dateB),
        id_Patient: idPatient
    })
}

//insertBookedAppointment("43480",new Date(2023,5,1),"118880354");

async function getAvailableAppointment(){
    let collection =  db.collection('availableAppointment');

    let cursor = await db.query(
        aql`FOR doc in ${collection}
        RETURN doc`)

    let array = await cursor.all();
    console.log(array)
}

async function getAvailableAppointmentsForArea(idArea){
    let collection =  db.collection('availableAppointment');

    let cursor = await db.query(
        aql`FOR doc in ${collection}
        FILTER doc.id_Area == ${idArea}
        RETURN doc`)

    let array = await cursor.all();
    return array;
}

async function getCategoriesArea(){
    let collection = db.collection('categoryArea');
    let cursor = await db.query(
        aql`FOR doc in ${collection}
        RETURN doc`)
    let array = await cursor.all();
    return array;
}

async function getBookedAppointments(){
    let collection =  db.collection('bookedAppointment');
    let cursor = await db.query(
        aql`FOR doc in ${collection}
        RETURN doc`)
    let array = await cursor.all();
    console.log(array);
}

async function getBookedAppointmentsForArea(idArea){
    console.log(idArea);
    let collection =  db.collection('bookedAppointment');

    let cursor = await db.query(
        aql`FOR doc in ${collection}
        FILTER doc.id_Area == ${idArea}
        RETURN doc`)

    let array = await cursor.all();
    console.log(array);
    return array;
}

async function getbookedAppointmentPatient(idPatient){
    let collection =  db.collection('bookedAppointment');
    let cursor = await db.query(
        aql`FOR doc in ${collection}
            FILTER doc.id_Patient == ${idPatient}
            RETURN doc`)

    let array = await cursor.all();
    console.log(array);
}

getAvailableAppointment()