const crypto = require('crypto');
//const connection = require('../database/connection');
const firebase = require("firebase");

const credentials = require ('../database/credentials');

var fAuth = firebase.auth();
var admin = require("firebase-admin");

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
        const { name, email, password } = request.body; /*data { name, email, whatsapp, city, uf }*/
        /*console.log(data);*/
        const id = crypto.randomBytes(4).toString('HEX');  /*Para capturar o id gerado*/
            
        admin.auth().createUser({
            email: email,
            emailVerified: false,
            phoneNumber: '+11234567890',
            password: password,
            displayName: name,
            photoURL: 'https://cdn.fastly.picmonkey.com/contentful/h6goo9gw1hh6/2C3VXIVGMfmU5C260BJ45t/57005d814375fdf6c6c1e7a66a3a6605/photo-editing.jpg?w=575&q=70',
            disabled: false
        })
        .then(function(userRecord) {
            console.log('Successfully created new user:', userRecord.uid);
          })
          .catch(function(error) {
            console.log('Error creating new user:', error);
          });

        /* AUTH CREATE USERS */
       /* fAuth.createUserWithEmailAndPassword(email, password)
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
            */
        /*const newOng = await db.collection('ongs').doc(id).set({
            id: id,           
            email: email,
            password: password     
        })*/
        return response.json({ id });
    }
};