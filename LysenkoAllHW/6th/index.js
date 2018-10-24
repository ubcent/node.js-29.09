const path           = require('path')
const express        = require('express')
const mongoose       = require('mongoose')
const cookieParser   = require('cookie-parser')
const bodyParser     = require('body-parser')
const session        = require('cookie-session')
const consolidate    = require('consolidate')
const db             = require('./config/db')
const adminModel     = require('./models/adminSchema')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const sha256         = require('sha256')

const port           = 8000

const app            = express()

app.engine('pug', consolidate.pug)
app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'views'))

app.use(cookieParser())
app.use(session({ keys: ['secret'] }))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

mongoose.connect(db.url).then(
  () => {console.log(`Mongo alive`)},
  err => {console.log(err)}
)

passport.use(new LocalStrategy((username, password, done) => {
  adminModel.findOne({ username: username }, (err, docs) => {
    if (err) {
      console.log(err)
      return done(null, false)
    }

    if (!docs) {
      return done(null, false)
    }
    const hashedPass = sha256(password)

    if (hashedPass !== docs.password){
      return done(null, false)
    }

    return done(null, docs)
  })
  
}))

const authHandler = passport.authenticate('local', {
  successRedirect: `/index?auth=true`,
  failureRedirect: '/auth',
})

app.get('/index', (req, res) => {
  res.render('index', {
    auth: req.body.auth 
  })
})

app.get('/auth', (req, res) => {
  res.render('auth')
})

app.post('/auth', authHandler)

app.listen(port, () => {
  console.log(`I'm alive on ${port}`)
})