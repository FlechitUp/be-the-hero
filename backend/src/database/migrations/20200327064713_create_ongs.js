
exports.up = function(knex) {

  //Olhar na documentacao de knex para criar tabelas,
  return knex.schema.createTable('ongs',function (table) {   
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('whatsapp').notNullable();
    table.string('city').notNullable();
    table.string('uf',2).notNullable(); //2 e para dizer o tamanho
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('ongs');
};
