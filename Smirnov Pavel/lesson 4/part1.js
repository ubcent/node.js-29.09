const request = require("request");
const cheerio = require("cheerio");
const express = require("express");
const temph = require("consolidate");
const bodyParser = require("body-parser");

const app = express();
app.engine('hbs', temph.handlebars);
app.set('view engine', 'hbs');
app.set('views', '');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
    //написал союственную функцию для парсинга куки
    //в данном случае, думаю, это допустимо, так как я сам создаю куки
    let cookie = cParser(req.headers["cookie"]);
    //
    if(cookie !== " 0"){
        let answer = cookie.split(" ")[0];
        let cnt = cookie.split(" ")[1];
        let prom = new Promise((resl, rej)=>{
            let hrf = "";
            let news = [];
            if(isNaN(cnt)){
                cnt = 9;
            }
            if(answer == "a1"){
                hrf = "https://news.yandex.ru/business.html?from=rubric";
            } else if(answer == "a2"){
                hrf = "https://news.yandex.ru/society.html?from=rubric";
            } else if(answer == "a3"){
                hrf = "https://news.yandex.ru/politics.html?from=rubric";
            }

            request(hrf, (error, response, html) =>{
                if(!error && response.statusCode == 200){
                    let $ = cheerio.load(html);
                    $(".story__title").children("a.link").each((i, elem)=>{
                        if(i < cnt){
                            news.push($(elem).text());
                        }
                    });
                    resl(news);
                }
            });
        });
        prom.then((result)=>{
            /*res.cookie("params", `answer${answer}*count${cnt}`);
            console.log(cnt+ "at first render");*/
            res.render('hello', {
                news: result
            });
        }, (error)=>{
            console.log(error);
        })

    } else {
        res.render('hello', {
            news: ['Выберите новости']
        });
    }
});
app.post('/news', function(req, res){
    app.use(bodyParser.urlencoded({extended: false}));
    let prom = new Promise((resl, rej)=>{
        let hrf = "";
        let news = [];
        let cnt = 9;
        if(!isNaN(req.body.count)){
            cnt = req.body.count;
        }
        if(req.body.answer == "a1"){
            hrf = "https://news.yandex.ru/business.html?from=rubric";
        } else if(req.body.answer == "a2"){
            hrf = "https://news.yandex.ru/society.html?from=rubric";
        } else if(req.body.answer == "a3"){
            hrf = "https://news.yandex.ru/politics.html?from=rubric";
        }

        request(hrf, (error, response, html) =>{
            if(!error && response.statusCode == 200){
                let $ = cheerio.load(html);
                $(".story__title").children("a.link").each((i, elem)=>{
                    if(i < cnt){
                        news.push($(elem).text());
                    }
                });
                resl(news);
            }
        });
    });
    prom.then((result)=>{
        res.cookie("params", `answer${req.body.answer}*count${req.body.count}`);
        res.render('hello', {
            news: result
        });
    }, (error)=>{
        console.log(error);
    })
});


let cParser = (data) =>{
    let answer ="";
    let count = 0;
    if(data){
        let result = data.split("; ");
        result.forEach((line)=>{
            if(!line.indexOf("params")){
                answer = line.split("answer")[1].split("*")[0];
                count = line.split("count")[1];
            }
        });
    }
    return answer + " " + count;
};
app.listen(3000);