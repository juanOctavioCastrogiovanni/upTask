const Usuarios = require('../models/Usuario')

module.exports = {
    formCrearCuenta: (req, res) => {
        res.render('crearCuenta', {
            nombrePagina : "Crear cuenta"
        })
    },
    formIniciarSesion: (req, res) => {
        res.render('iniciarSesion', {
            nombrePagina : "Iniciar sesion en Uptask"
        })
    },
    crearCuenta: async (req, res) => {
        // leer los datos
    const { email, password} = req.body;

        try {
            // crear el usuario
            await Usuarios.create({
                email, 
                password
            });

            // crear una URL de confirmar
            
        } catch (error) {
            req.flash('error', error.errors.map(error => error.message));
            // console.log(req.flash(), 'mensaje de flash')

            res.render('crearCuenta', {
                mensajes: req.flash(),
                nombrePagina : 'Crear Cuenta en Uptask', 
                email,
                password
            })
        }
    },
    
    
}