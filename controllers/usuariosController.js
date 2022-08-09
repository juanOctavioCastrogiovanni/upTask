const Usuarios = require('../models/Usuario')

module.exports = {
    formCrearCuenta: (req, res) => {
        res.render('crearCuenta', {
            nombrePagina : "Crear cuenta"
        })
    },
    crearCuenta: async (req, res) => {
        const {email, password} = req.body;

        let resultado = await Usuarios.create({
            email,password
        })

        if(resultado){
            res.redirect('/iniciar-sesion')
        }
    },
    
    
}