const request = require("request");
const cheerio = require("cheerio");

request("https://www.yandex.ru", (error, response, html) =>{
    if(!error && response.statusCode == 200){
        let $ = cheerio.load(html);
        $("#tabnews_newsc").children(".news__list").children(".list__item").children("a.home-link").each((i, elem)=>{
            console.log($(elem).attr("aria-label"));
        });
    }
});