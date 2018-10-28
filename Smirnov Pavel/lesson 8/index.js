const express = require("express");
const temph = require("consolidate");
const bodyParser = require("body-parser");
const db = require("./mod");
const jwt = require('jsonwebtoken');
const http = require("http");
const socket = require("socket.io");
const socketioJwt   = require("socketio-jwt");


const KEY = 'secret';
const app = express();
app.engine('hbs', temph.handlebars);
app.set('view engine', 'hbs');
app.set('views', '');

const server = http.Server(app);
const io = socket(server);


io.use(socketioJwt.authorize({
    secret: KEY,
    handshake: true
}));

io.on("connection", (socket)=>{
    console.log('Connected ', socket.decoded_token);
    socket.on("get", ()=>{
        db.get().then((result)=>{
            socket.emit("getReturn", result);
        });
    });
    socket.on("post", (data)=>{
        db.insert(data.post).then((result)=>{
            socket.broadcast.emit("postReturn", {post: data.post, id: result.insertId});
            socket.emit("postReturn", {post: data.post, id: result.insertId});
        });
    });
    socket.on("put", (data)=>{
        db.update(data).then((result)=>{
            socket.broadcast.emit("putReturn", {post: data.text, id: data.idPost});
            socket.emit("putReturn", {post: data.text, id: data.idPost});
        });
    });
    socket.on("delete", (data)=>{
        db.delete(data.id).then((result)=>{
            socket.broadcast.emit("deleteReturn", {id: data.id});
            socket.emit("deleteReturn", {id: data.id});
        });
    });
});

app.use(bodyParser.json());


function verifyToken(req, res, next) {
    const authorization = req.headers['authorization'];
    if(!authorization) {
        res.render('hello')
    } else{
        jwt.verify(authorization, KEY, (err, decoded) => {
            if(err) {
                res.render('hello');
            } else{
                next();
            }
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
            res.render('hello')
        }
    });
});

app.all('/', verifyToken);
app.get('/', (req, res)=>{
    res.status(200);
    res.send();
});

server.listen(80);

