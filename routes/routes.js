const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');
// const { body, check , validationResult} = require('express-validator/check')


router.get('/' , proyectosController.indexController);
router.get('/nuevoProyecto' , proyectosController.nuevoProyecto);
router.post('/nuevoProyecto' , proyectosController.datosFormulario);


module.exports = router;  