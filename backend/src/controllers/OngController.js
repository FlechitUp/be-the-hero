const crypto = require('crypto');
//const connection = require('../database/connection');
const firebase = require("firebase");
const credentials = require ('../database/credentials');

var fAuth = firebase.auth();
var db = firebase.firestore();

/*const db = firebase.firestore();*/

module.exports = {

    
    async index(request, response) {
        //let ongs = db.collection('ongs');
        //const ongs = await connection('ongs').select('*');
        const ongs = db.collection('ongs');        
    
        return response.json(ongs); 
    },
    
    async create(request, response) {
        const { email, password } = request.body; /*data { name, email, whatsapp, city, uf }*/
        /*console.log(data);*/
        const id = crypto.randomBytes(4).toString('HEX');  /*Para capturar o id gerado*/
            
        
        fAuth.createUserWithEmailAndPassword(email, password)
            .then(function(user){
                var user = fAuth.currentUser;
            },function(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    console.error(error);
                }
            });
        /*const newOng = await db.collection('ongs').doc(id).set({
            id: id,           
            email: email,
            password: password     
        })*/        
        
        return response.json({ id });
    }
};