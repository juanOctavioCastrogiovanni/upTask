

const express = require('express');
const router = require('./routes/routes');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const helpers = require('./helpers');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/passport');
const enviarCorreo = require('./handlers/email');
// crear conexion
require('./models/Proyecto')
require('./models/Tarea')
require('./models/Usuario')

const db = require("./config/db");

//crea la tabla, siempre y cuando requiera el modelo con la estructura de la misma
db.sync().then(() => console.log('conectado al servidor')).catch(console.log)

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// utilizacion de express validator
app.use(expressValidator());

//habilitar bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//habilitar pug
app.set('view engine', 'pug');

//connect-flash
app.use(flash());

app.set(cookieParser());

//session
app.use(session({
    secret: 'superSecreto',
    reseve: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//helper de vardump
app.use((req,res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    // console.log(res.locals.mensajes, 'mensaje de middleware global')
    next();
}) 

// carpeta de vistas
app.set('views', path.join(__dirname, "./views"));


app.use('/', router);


app.listen(3000, () => console.log("corriendo express"));
