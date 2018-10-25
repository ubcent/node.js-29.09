const express = require("express");
const temph = require("consolidate");
const bodyParser = require("body-parser");
const db = require("./mod");
const jwt = require('jsonwebtoken');

const KEY = 'secret';
const app = express();
app.engine('hbs', temph.handlebars);
app.set('view engine', 'hbs');
app.set('views', '');
//2 дня маялс, не работает бодипарсер в режиме json
//не пойму вообще
//пустой объект body и все тут
//app.use(bodyParser.urlencoded({extended: false}));
/*app.use(bodyParser.urlencoded({
    extended: true
}));*/
app.use(bodyParser.json());


function verifyToken(req, res, next) {
    const authorization = req.headers['authorization'];
    if(!authorization) {
        res.render('hello', {
            todo: {},
            auth: 0
        })
    } else{
        jwt.verify(authorization, KEY, (err, decoded) => {
            if(err) {
                res.render('hello', {
                    todo: {},
                    auth: 0
                })
            }
            req.user = decoded;
            next();
        });
    }
}

app.post('/auth', (req, res) => {
    db.getUser(req.body).then((result)=>{
        if(result[0]) {
            const {id, username} = result[0];
            res.json({
                access_token: jwt.sign({id, username}, KEY),
            });
        } else {
            res.render('hello', {
                todo: {},
                auth: 0
            })
        }
    });
});

app.all('/', verifyToken);

app.get('/', function(req, res){
    //Функция возвращает промис
    db.get().then((result)=>{
        res.json(result);
    });
});
app.post('/', (req, res)=>{
    db.insert(req.body.post).then((result)=>{
        res.json({id: result.insertId});
    });
});
app.put('/', (req, res)=>{
    db.update(req.body).then((result)=>{
        res.sendStatus(200);
    });
});
app.delete('/', (req, res)=>{
    db.delete(req.body.id).then((result)=>{
        res.sendStatus(200);
    });
});
app.listen(80);

