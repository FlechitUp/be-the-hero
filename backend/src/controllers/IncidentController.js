const connection = require('../database/connection');
const firebase = require("firebase");

const credentials = require('../database/credentials');

var fAuth = firebase.auth();
var admin = require("firebase-admin");

var db = firebase.firestore();
var storage = firebase.database();

const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({storage: storage}).single('file')


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

  async create(req, res) {

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err)
      } else if (err) {
        return res.status(500).json(err)
      }
      console.log(req.body)

      const {title, description, value, user_id} = req.body;
            console.log(title, description, value)

      var incidentId = new Date().getTime();
      incidentId = incidentId.toString();
      console.log(incidentId)
      //     /*const [id] = await connection('incidents').insert({
      //         title,
      //         description,
      //         value,
      //         ong_id
      //     });*/
      //     //console.log(user_id);
      const id = db.collection('incidents').doc(incidentId).set({
        title: title,
        description: description,
        value: value,
        // image: image,
        // user_id: user_id
      });
      //     // const filePath = '/home/xime/Descargas/1.jpg'
      //     //
      //     // const bucket = admin.storage().bucket();
      //     // console.log('tit ',image);
      //     // const task = await bucket.upload( filePath, image);
      //
      //     /*image.name), {
      //     destination: '/3.jpg',
      //
      //     gzip: true,
      //
      // }).then(() => {
      //     console.log(`3.jpg uploaded.`);
      // }).catch(err => {
      //     console.error('ERROR:', err);
      // });*/
      //     /*const img = storage.ref("gs://be-the-hero-project.appspot.com");/*`/images/${image.name}`);/*.put(image)*/
      //     //console.log("img", img);
      //
      //
      //     return response.json({id});
      return res.status(200).send(req.file)
    })

  },

  async delete(request, response) {
    const {id} = request.params;
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