const connection = require('../database/connection');

module.exports = {

    async create(request,response){
        const { id } = request.body;
        const ong  = await connection('ongs')
            .where('id',id)
            .select('name')
            .first();

        if (!ong){
            //400 Bad request, alguma coisa eta errada
            return response.status(400).json({ error: 'no Ong found with this id' });
        }

        return response.json(ong);
    }
}