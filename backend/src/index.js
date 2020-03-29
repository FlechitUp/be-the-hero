/*Arquivo principal da aplicacao */
/**
 * executar back-end com:    node index.js
 */
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