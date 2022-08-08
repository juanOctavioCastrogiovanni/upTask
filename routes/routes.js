const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const proyectosController = require('../controllers/proyectosController');
// const { body, check , validationResult} = require('express-validator/check')


router.get('/' , proyectosController.indexController);
router.get('/nuevoProyecto' , proyectosController.nuevoProyecto);
router.get('/proyectos/:url' , proyectosController.detalleProyecto);
router.delete('/proyectos/:url', proyectosController.eliminarProyecto );
router.get('/proyecto/editar/:id' , proyectosController.formularioEditar);
router.post('/proyectos/tarea/:url', tareasController.agregarTarea );
router.post('/nuevoProyecto' , proyectosController.datosFormulario);
router.post('/nuevoProyecto/:id' , proyectosController.editarProyecto);


module.exports = router;  