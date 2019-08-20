exports.up = function(knex) {
    return knex.schema.table('news', function(t) {
        t.string('news_identifier').notNull().defaultTo('');
    });
};

exports.down = function(knex) {
    return knex.schema.table('news', function(t) {
        t.dropColumn('news_identifier');
    });
};
