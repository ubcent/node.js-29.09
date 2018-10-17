const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/animals');

const Animal = require('./models/animals');


const app = express();

app.engine('hbs', consolidate.handlebars);

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log('Middleware');
  next();
});

app.use(express.static('./public'));

app.get('/animals', async (req, res) => {
  const animals = await Animal.find();
  res.json(animals);
});

app.get('/animals/:id', async (req, res) => {
  const animal = await Animal.findById(req.params.id);
  res.json(animal);
})

app.listen(3000)

