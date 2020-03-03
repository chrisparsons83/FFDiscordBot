const Discord = require('discord.js');
const https = require('https');
const fs = require('fs');

function get_id(full_name, callback) {
    let raw_sleeper_data = fs.readFileSync('/fantasy/data/sleeper/all_players.json');
    let sleeper_player_data = JSON.parse(raw_sleeper_data);
    for (var id in sleeper_player_data) {
        if (json_data[id]['full_name'] == full_name) {
            return callback(json_data[id]['player_id']);
        }
    }

    return `The player "${full_name}" is not defined.`;
}

function get_stats(id, season_year, callback) {
    https.get(`https://api.sleeper.app/v1/stats/nfl/regular/${season_year.replace(' ', '')}`, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            let json_data = JSON.parse(data);

            return callback(json_data[id]);
        });
    });
}

function get_gamestats(id, season_year, week, callback) {
    https.get(`https://api.sleeper.app/v1/stats/nfl/regular/${season_year.replace(' ', '')}/${week.replace(' ', '')}`, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            let json_data = JSON.parse(data);

            return callback(json_data[id]);
        });
    });
}

function get_projections(id, week, season_year, callback) {
    https.get(`https://api.sleeper.app/v1/projections/nfl/regular/${season_year.replace(' ', '')}/${week.replace(' ', '')}`, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            let json_data = JSON.parse(data);

            return callback(json_data[id]);
        });
    });
}

module.exports = { id: get_id, stats: get_stats, gamestats: get_gamestats, projections: get_projections };