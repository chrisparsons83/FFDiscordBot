const request = require('request');
const url = 'https://strawpoll.me/api/v2/polls';
exports.getPoll = (question, answers) => {
  let poll = {
    'title': question,
    'options': answers,
    'multi': false,
  }
  return new Promise((resolve, reject) => {
    request.post({
      url: 'https://strawpoll.me/api/v2/polls',
      followAllRedirects: true,
      body: poll,
      json: true
    }, (error, response, body) => {
      if(error && response.statusCode !== 200) {
        reject(error);
      } else {
        let id = body.id;
        resolve(`http://www.strawpoll.me/${id}`);
      }
    })
  });
}