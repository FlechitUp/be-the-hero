
exports.up = function(knex) {
    return knex.schema.createTable('incidents',function (table) {   
        table.increments();  //Automaticamente chave primaria
        table.string('title').notNullable();
        table.string('description').notNullable();
        table.decimal('value').notNullable();
    //Chave extrangeira
        table.string('ong_id').notNullable();  
        table.foreign('ong_id').references('id').inTable('ongs');
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('incidents');
};

/*Depois de criar este arquivo-migration correr com:
    npx knex migrate:latest
*/
/* Para deletar a migracao:
    npx knex migrate:rollback
*/