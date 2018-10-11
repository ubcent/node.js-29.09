const request = require('request');

const site = 'http://lenta.ru';
const pattern = /<\/time>(?!<\/div>)(.*?)<\/a>/gm;

function getRequest(site) {
  request(site, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      parse(body, pattern);
    }
  });
}

function parse(body, pattern) {
  let matches;

  while ((matches = pattern.exec(body)) !== null) {
    console.log(matches[1].replace(/&nbsp;/g, ' '));
  }
}

getRequest(site);
