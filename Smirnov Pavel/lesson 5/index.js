const express = require("express");
const temph = require("consolidate");
const bodyParser = require("body-parser");
const db = require("./mod");

const app = express();
app.engine('hbs', temph.handlebars);
app.set('view engine', 'hbs');
app.set('views', '');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
    db.start();
    //Функция возвращает промис
    db.get().then((result)=>{
        res.render('hello', {
            todo: result
        })
    });
});
app.post('/newpost', (req, res)=>{
    db.insert(req.body.post).then((result)=>{
        res.end(JSON.stringify({id: result.insertId}));
    });
});
app.listen(80);

