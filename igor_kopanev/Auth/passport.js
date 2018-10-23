const path = require ('path')
const bodyParser = require ('body-parser');
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('cookie-session')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const template = require('consolidate')


const app = express()
const urlencodedParser = (bodyParser.urlencoded({extended: false}));
app.use(cookieParser())
app.use(session({ keys: ['secret']}))

app.use(passport.initialize())
app.use(passport.session())

app.engine('hbs', template.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname,'views'));

//authentication

passport.use(new localStrategy((username, password, done) => {
    //here we go on databases, but for now is just simple example
    if(username !== 'admin') {
        return done(null, false )
    }
    if(password !== 'admin') {
        return done(null, false )
    }

    return done(null, { firstname: 'Ivan', lastname: 'Draga', id: 1})

}))

const authHandler = passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/auth',
})

app.get('/auth', (req, res) => {
    res.render('auth')
})

app.post('/auth', authHandler)


const mustBeAuthenticated = (req, res, next) => {
    if(req.user) {
        next()
    } else {
        res.redirect('/auth')
    }
}

app.all('/user', mustBeAuthenticated)
app.all('/user/*', mustBeAuthenticated)

app.get('/user', (req, res) => {
    res.render('user')
})

app.listen(3000)