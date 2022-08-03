const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');

router.get('/' , proyectosController.indexController);
router.get('/nuevoProyecto' , proyectosController.nuevoProyecto);
router.post('/nuevoProyecto' , proyectosController.datosFormulario);


module.exports = router;  