
exports.up = function (knex) {
    return Promise.all([
      knex.schema.createTable('news', table => {
        table.increments('news_id').primary();
        table.string('title');
        table.string('description');
        table.integer('is_published').defaultTo(false);
      })
    ])
}
  
exports.down = function (knex) {
    return Promise.all([
      knex.schema.dropTable('news')
    ])
}