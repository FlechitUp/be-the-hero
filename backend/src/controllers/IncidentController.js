const connection = require('../database/connection');
const firebase = require("firebase");

var admin = require("firebase-admin")
const credentials = require ('../database/credentials');

var fAuth = firebase.auth();
var admin = require("firebase-admin");

var db = firebase.firestore();
var storage = firebase.database();


//var storageRef = firebase.storage().ref();
//import { storage } from "./firebase";

module.exports = {
    async index(request, response) {
        //Paginacion
        // GET en Insomnia o Postman:  http://localhost:3333/incidents?page=4
        const { page = 1 } = request.query;
       
        const [count] = await connection('incidents').count();        
        //console.log(count);      

        const incidents = await connection('incidents').select('*')
            .join('ongs', 'ong_id', '=', 'incidents.ong_id')  //Join para traer os dados da tabla ongs como: whatsapp, email, coty, uf
            .limit(5)   //Limitar por page 5 incidentes
            .offset( (page - 1)*5)  //Omitir nos proximos 5 registros
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);        
        
        // !! Revisar na Insomnia, na parte de Header a variabel X-Total-Count
        response.header('X-Total-Count', count['count(*)']);  //Retorna ao front-end a quantidade de registros. 

        //return response.json(incidents); 
    },
    
    async create(request,response){
        const busboy = new BusBoy({ headers: request.headers });
        
        const { title, description, image, value } = request.body;
        const user_id = request.headers.authorization;
        var incidentId = new Date().getTime();  
        incidentId = incidentId.toString();
        /*const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });*/
        //console.log(user_id);
        const id = db.collection('incidents').doc(incidentId).set({
            title: title,
            description: description,            
            value:value,
            image: image,
            user_id:user_id
        });
        const filePath = '/home/xime/Descargas/1.jpg'
        
        const bucket = admin.storage().bucket();
        console.log('tit ',image);
        const task = await bucket.upload( filePath, image);

            /*image.name), {
            destination: '/3.jpg',

            gzip: true,
            
        }).then(() => {
            console.log(`3.jpg uploaded.`);
        }).catch(err => {
            console.error('ERROR:', err);
        });*/
        /*const img = storage.ref("gs://be-the-hero-project.appspot.com");/*`/images/${image.name}`);/*.put(image)*/
        //console.log("img", img);
        

        return response.json({ id });
    },

    async delete(request, response){
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();  //Para retornar somente 1 resultado

        if (incident.ong_id != ong_id){
            return response.status(401).json({ error: "Operation not permited." });   // 401 HTTP STATUS CODE: nAO AUTHORIZED
        }

        await connection('incidents').where('id',id).delete();

        return response.status(204).send(); //204 Resposta sem conteudo
    }

};