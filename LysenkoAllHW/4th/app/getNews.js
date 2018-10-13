const request = require('request')
const cheer = require('cheerio')
const log = console.log;

class GetNews {
  getNewsList(cb){
    request('https://tjournal.ru/', (err, resp, body) => {
      let list = []

      if (!err && resp.statusCode == 200) {
        const $ = cheer.load(body)
        $('.b-article h2 span').each(function (i, elem) {
          list.push($(this).text())
        })
      } else { log(`Request down`) }
      
      cb(list)
    })
  }

  renderList(){
    
  }
}

module.exports = GetNews
