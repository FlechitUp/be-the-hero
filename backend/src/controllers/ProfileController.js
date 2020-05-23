const connection = require('../database/connection');
const firebase = require("firebase");
const credentials = require('../database/credentials');
const IncidentController = require('./IncidentController');

var fAuth = firebase.auth();
var db = firebase.firestore();

module.exports = {
  async index(request, response) {

    const ong_id = request.headers.authorization;

    let allIncidents = []
    const incidents = db.collection('incidents')
    let allCities = incidents.get()
      .then(snapshot => {
          snapshot.forEach(doc => {
            allIncidents.push(doc.data());
            // console.log(doc.id, '=>', doc.data());
          });
          return response.json(allIncidents);
        }
      )
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }
}