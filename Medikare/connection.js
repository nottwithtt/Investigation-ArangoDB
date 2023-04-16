const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {Database} = require('arangojs');
const aql = require('arangojs').aql;

const bcrypt = require('bcrypt');


const db = new Database({
    url:'http://127.0.0.1:8529/',
    databaseName: 'DBInvestigation'
});

db.useBasicAuth('root','1998Investigation');

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