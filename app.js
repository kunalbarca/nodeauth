const express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    expressValidator = require('express-validator'),
    flash = require('connect-flash'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongo = require('mongodb'),
    mongoose = require('mongoose');

//Connection to Databse
mongoose.connect('mongodb://localhost/loginapp');
const db = mongoose.connection;

//Define routes
const routes = require('./routes/index'),
    users = require('./routes/users');

//Initialize application
const app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'mainLayout'}));
app.set('view engine', 'handlebars');

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
    errorFormatter: function(params, msg, value){
        const namespace = params.split('.'),
            root = namespace.shift(),
            formParam = root;
        while(namespace.length){
            formParam += '[' +namespace.shift() + ']';
        }
        return{
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

//Connect flash
app.use(flash());

//Global variables for flash messages
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', routes);
app.use('/users', users);

// Setup port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
   console.log('Server started at port: '+app.get('port')); 
});