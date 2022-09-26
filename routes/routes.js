const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const proyectosController = require('../controllers/proyectosController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
// const { body, check , validationResult} = require('express-validator/check')


router.get('/' ,authController.usuarioAutenticado, proyectosController.indexController);
router.get('/nuevoProyecto' , authController.usuarioAutenticado, proyectosController.nuevoProyecto);
router.get('/proyectos/:url' , authController.usuarioAutenticado, proyectosController.detalleProyecto);
router.delete('/proyectos/:url', authController.usuarioAutenticado, proyectosController.eliminarProyecto);
router.delete('/proyectos/tarea/borrar/:id', authController.usuarioAutenticado, tareasController.eliminarTarea);
router.get('/proyecto/editar/:id' , authController.usuarioAutenticado, proyectosController.formularioEditar);
router.post('/proyectos/tarea/:url', authController.usuarioAutenticado, tareasController.agregarTarea );
router.patch('/proyectos/tarea/estado/:id', authController.usuarioAutenticado, tareasController.cambiarEstado);
router.patch('/proyectos/tarea/nombre/:id/:nombre', authController.usuarioAutenticado, tareasController.cambiarNombre);
router.patch('/proyectos/estado/:url/:estado', authController.usuarioAutenticado, proyectosController.cambiarEstado);
router.post('/nuevoProyecto' , authController.usuarioAutenticado, proyectosController.datosFormulario);
router.post('/nuevoProyecto/:id' , authController.usuarioAutenticado, proyectosController.editarProyecto);

//rutas usuarios
router.get('/crear-cuenta', usuariosController.formCrearCuenta);
router.post('/crear-cuenta', usuariosController.crearCuenta);

//rutas usuarios iniciar secion
router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
router.post('/iniciar-sesion', authController.autenticarUsuario);

// cerrar sesion
router.get('/cerrar-sesion', authController.cerrarSesion);

//reestablecer contraseña
router.get('/reestablecer', usuariosController.formEmail);
router.post('/reestablecer', usuariosController.crearToken);
router.get('/verificarUsuario/:token', usuariosController.validarToken);
router.post('/verificarUsuario/:token', usuariosController.activarCuenta);


module.exports = router;  