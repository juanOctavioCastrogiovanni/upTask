// AuthController.js
const passport = require('passport');
const purgar = require('../funciones/purgarUsuario')



// autenticar el usuario
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/iniciar-sesion',
    failureFlash : true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});



// Función para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    // si el usuario esta autenticado, adelante
    if(req.isAuthenticated()) {
        return next();
    }
    purgar();
    // sino esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// función para cerrar sesión
exports.cerrarSesion = (req, res) => {
    purgar();
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); // al cerrar sesión nos lleva al login
    })
}

