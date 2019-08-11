
exports.up = function(knex) {
    return knex.schema.table('news', function(t) {
        t.string('author').notNull().defaultTo('');
    });
};

exports.down = function(knex) {
    return knex.schema.table('news', function(t) {
        t.dropColumn('author');
    });
};
