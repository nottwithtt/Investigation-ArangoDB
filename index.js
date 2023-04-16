const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {Database, aql} = require('arangojs')

const db = new Database({
    url:'http://127.0.0.1:8529',
    databaseName: 'DBInvestigation'
})

db.useBasicAuth('root','Soldadojeff01');

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

app.post('/getCitasTomadas')


async function insertCitasDisponibles(idArea,Fecha){
    await db.collection('citasDisponibles').save({
        id_Area: idArea,
        fecha_Cita: new Date(Fecha)
    })
}

async function deleteCitasDisponibles(idCita){
   await db.collection('citasDisponibles').remove(idCita);
}

async function insertCitasTomadas(idArea,Fecha,idPaciente){
    await db.collection('citasTomadas').save({
        id_Area: idArea,
        fecha: new Date(Fecha),
        id_Paciente: idPaciente
    })
}
async function getCitasDisponibles(){
    let collection =  db.collection('citasDisponibles');

    let cursor = await db.query(
        aql`FOR doc in ${collection}
        RETURN doc`)

    let array = await cursor.all();
    console.log(array)
}

async function getCitasTomadas(){
    let collection =  db.collection('citasTomadas');
    let cursor = await db.query(
        aql`FOR doc in ${collection}
        RETURN doc`)
    let array = await cursor.all();
    console.log(array)
}

async function getCitasTomadasPaciente(idPaciente){
    let collection =  db.collection('citasTomadas');
    let cursor = await db.query(
        aql`FOR doc in ${collection}
            FILTER doc.id_Paciente == ${idPaciente}
            RETURN doc`)

    let array = await cursor.all();
    console.log(array)
}

getCitasDisponibles()