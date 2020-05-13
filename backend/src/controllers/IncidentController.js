const connection = require('../database/connection');
const firebase = require("firebase");
const credentials = require('../database/credentials');

var fAuth = firebase.auth();
var db = firebase.firestore();

module.exports = {
  async index(request, response) {
    //Paginacion
    // GET en Insomnia o Postman:  http://localhost:3333/incidents?page=4
    const {page = 1} = request.query;

    const [count] = await connection('incidents').count();
    //console.log(count);

    const incidents = await connection('incidents').select('*')
      .join('ongs', 'ong_id', '=', 'incidents.ong_id')  //Join para traer os dados da tabla ongs como: whatsapp, email, coty, uf
      .limit(5)   //Limitar por page 5 incidentes
      .offset((page - 1) * 5)  //Omitir nos proximos 5 registros
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

    // return response.json(incidents);
  },

  async create(request, response) {
    const {title, description, value} = request.body;
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
      value: value,
      user_id: user_id
    });

    return response.json({id});
  },
  async delete(request, response) {
    const {id} = request.params;
    console.log('__________________________', id);
    const ong_id = request.headers.authorization;

    const incidents = db.collection('incidents')
    let query = incidents.where('title', '==', id).get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          doc.ref.delete()
          // if (doc.id != ong_id) {
          //   return response.status(401).json({error: "Operation not permited."});   // 401 HTTP STATUS CODE: nAO AUTHORIZED
          // }
        });
        return response.status(204).send(); //204 Resposta sem conteudo

      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }
};