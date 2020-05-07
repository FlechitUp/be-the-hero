/*Arquivo principal da aplicacao */
/**
 * executar back-end com:    node index.js
 */

// admin.initializeApp(functions.config().firebase);

const express = require('express');  //express e um pacote
const cors = require('cors');
const routes = require('./routes'); // routes e um arquivo

//REMOVE:var bodyParser = require('body-parser');// instalar: npm install body-parser
//REMOVE: npm install connect

const app = express();


app.use(cors());  //Fica asim so pra desenvolivmento
                // Em producao ficaria asim:
                /* app.use(cors({
                    orgin: 'http://meuapp.com'
                })); */
app.use(express.json()); //json library
app.use(routes);  // isto tem que ficar embaixo de json library

app.listen(3333); //localhost:3333

const firebase = require("firebase");
const credentials = require ('./database/credentials');
firebase.initializeApp(credentials.firebaseConfig);

let db = firebase.firestore();

// access any collection
let booksRef = db.collection('books');

// add a register
let setSf = booksRef.doc('SF').set({
  name: 'San Francisco',
  state: 'CA', country: 'USA',
  capital: false,
  population: 860000,
  regions: ['west_coast', 'norcal']
});

// update a register
let updateSf = booksRef.doc('SF').update({
  name: 'San Francisco update', state: 'CA', country: 'USA',
  });


// select with where
let query = booksRef.where('capital', '==', false).get()
  .then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });


// delete fields

// Remove the 'capital' field from the document
let removePopulation = booksRef.doc('SF').update({
  population: firebase.firestore.FieldValue.delete()
});

// delete all collection
// https://firebase.google.com/docs/firestore/manage-data/delete-data
