const path           = require('path');
const express        = require('express')
const MongoClient    = require('mongodb').MongoClient
const db             = require('./config/db')
const bodyParser     = require('body-parser')
const app            = express()
const mongoose       = require('mongoose')
const consolidate    = require('consolidate');

const Line           = require('./app/database')

const port           = 8000;

app.engine('pug', consolidate.pug);
app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));


mongoose.connect(db.url, {dbName: 'db'}).then(
  () => {console.log(`Mongo alive`)},
  err => {console.log(err)}
)

app.post('/todolist', async (req, res) => {
  const newTask = new Line ({ title: req.body.title, text: req.body.text })
  newTask.save(err => {
    if(err){
      console.log(err)
    }
    res.redirect('/todolist')
  })
})

app.get('/todolist', async(req, res) => {
  const list = await Line.find()
  res.render('index', {
    list: list
  })
})

app.get('/setdone', async(req, res) => {
  const id = await req.query.id
  await Line.findOneAndUpdate({_id: id}, {status: true})
  res.redirect('/todolist')
})

app.get('/delete', async(req, res) => {
  const id = await req.query.id
  await Line.findByIdAndRemove(id)
})

app.listen(port, () => {
  console.log(`I'm live on ${port}`)
})