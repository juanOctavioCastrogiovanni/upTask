const express = require('express');
const router = require('./routes/routes');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const helpers = require('./helpers');

// crear conexion
require('./models/Proyecto')
require('./models/Tarea')

const db = require("./config/db");

//crea la tabla, siempre y cuando requiera el modelo con la estructura de la misma
db.sync().then(() => console.log('conectado al servidor')).catch(console.log)

// Donde cargar los archivos estaticos
app.use(express.static('public'));

//habilitar bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//habilitar pug
app.set('view engine', 'pug');

//helper de vardump
app.use((req,res, next) => {
    res.locals.vardump = helpers.vardump;
    next();
}) 

// carpeta de vistas
app.set('views', path.join(__dirname, "./views"));


app.use('/', router);


app.listen(3000, () => console.log("corriendo express"));
