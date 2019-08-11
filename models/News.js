'use strict';

const { Model } = require('objection');

class News extends Model {
    static get tableName() {
        return 'news';
    }
}

module.exports = News;