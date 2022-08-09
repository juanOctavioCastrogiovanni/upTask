const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const proyectosController = require('../controllers/proyectosController');
const usuariosController = require('../controllers/usuariosController');
// const { body, check , validationResult} = require('express-validator/check')


router.get('/' , proyectosController.indexController);
router.get('/nuevoProyecto' , proyectosController.nuevoProyecto);
router.get('/proyectos/:url' , proyectosController.detalleProyecto);
router.delete('/proyectos/:url', proyectosController.eliminarProyecto );
router.delete('/proyectos/tarea/borrar/:id', tareasController.eliminarTarea );
router.get('/proyecto/editar/:id' , proyectosController.formularioEditar);
router.post('/proyectos/tarea/:url', tareasController.agregarTarea );
router.patch('/proyectos/tarea/estado/:id', tareasController.cambiarEstado )
router.patch('/proyectos/tarea/nombre/:id/:nombre', tareasController.cambiarNombre )
router.post('/nuevoProyecto' , proyectosController.datosFormulario);
router.post('/nuevoProyecto/:id' , proyectosController.editarProyecto);

//rutas usuarios
router.get('/crear-cuenta', usuariosController.formCrearCuenta);
router.post('/crear-cuenta', usuariosController.crearCuenta);


module.exports = router;  