const connection = require('../database/connection');

module.exports = {
    async index(request, response) {
        //Paginacao
        // GET na Insomnia ou Postman:  http://localhost:3333/incidents?page=4
        const { page = 1 } = request.query;

        const [count] = await connection('incidents').count();
        //console.log(count);

        const incidents = await connection('incidents').select('*')
            .join('ongs', 'ong_id', '=', 'incidents.ong_id')  //Join para traer os dados da tabela ongs como: whatsapp, email, coty, uf
            .limit(5)   //Limitar por page 5 incidentes
            .offset( (page - 1)*5)  //Pular nos proximos 5 registros
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

        return response.json(incidents); 
    },

    async create(request,response){
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

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