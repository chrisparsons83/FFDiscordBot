
exports.up = function(knex) {
    return knex.schema.alterTable('news', function(t) {
        t.string('description', 1000).alter();
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('news', function(t) {
        t.string('description', 255).alter();
    });
};
