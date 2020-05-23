//const connection = require('../database/connection');

const firebase = require("firebase");
const credentials = require ('../database/credentials');

var fAuth = firebase.auth();
var admin = require("firebase-admin");
var db = firebase.firestore();

module.exports = {

    async create(request,response){
        const { email, password } = request.body;
        //const id = request.body;
        /*const ong  = await connection('ongs')
            .where('id',id)
            .select('name')
            .first();*/
        /*const ong  = db.collection('ongs')
            .where('id', id)
            .select('name')
            .first();

        if (!ong){
            //400 Bad request, alguma coisa eta errada
            return response.status(400).json({ error: 'no Ong found with this id' });
        }*/        
        
        // AUTH SIMGIM USER
        fAuth.signInWithEmailAndPassword(email, password)
            .then(({user})=>{
                //The promise sends me a user object, now I get the token, and refresh it by sending true (obviously another promise)            
                user.getIdToken(true)
                
                .then((token)=>{
                    response.writeHead(200, {"Content-Type": "application/json"});
                    //console.log(token);
                    var userName = user.displayName;
                    var userId = user.uid;
                    response.end(JSON.stringify({token:token, userId: userId, userName:userName }))
                    

            //.then(function(user){
                //return response.json
            })},function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                response.status(400).json({ error: 'no Ong found with this id' });
        });

        //console.log(ong);
        //return response.json(ong);
    }
}