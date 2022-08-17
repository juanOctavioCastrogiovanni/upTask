const Usuarios = require('../models/Usuario');
const crypto = require('crypto')
const { Op } = require("sequelize");
const bcrypt = require('bcrypt-nodejs');

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

            res.redirect('/')
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

    formEmail: (req, res) => {
        res.render('reestablecer', {
            nombrePagina: 'Reestablecer contraseña',
        })
    },
    crearToken: async (req, res) => {
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where:{email}});

        if(!usuario){
            req.flash('error', 'No existe la cuenta');
            res.redirect('/reestablecer')
        } else {
            usuario.expiracion = Date.now() + 3600000;
            usuario.token = crypto.randomBytes(20).toString('hex');
            
            await usuario.save();
            
            const url = `http://${req.header.host}/verificarUsuario/${usuario.token}`;

            //enviar por correo

            req.flash('correcto', 'Se ha enviado el email correctamente, confirme en su casilla de correo');
            res.redirect('/reestablecer')
        }
    },

    validarToken: async (req, res) => {
        const {token} = req.params
        const usuario = await Usuarios.findOne({ where: { token, expiracion: { [Op.gte]: Date.now() } } });
        
        if(!usuario){
            req.flash('error', 'El tiempo de expiración se ha cumplido');
            res.redirect('/reestablecer')
        } else {
            res.render('resetPassword', {
                nombrePagina: 'Reestablecer contraseña',
            })
        }
    },
    activarCuenta: async (req, res) => {
        const {token} = req.params
        const {password} = req.body; 
        const {rePassword} = req.body; 
        if(password != rePassword){
            req.flash('error', 'Las contraseñas no son iguales')
            res.render('resetPassword', {
                nombrePagina: 'Reestablecer contraseña',
            })
        } else {
        
        const usuario = await Usuarios.findOne({ where: { token, expiracion: { [Op.gte]: Date.now() } } });
        // const usuario = await Usuarios.findOne({where:{token}})
        if (!usuario){
            req.flash('error', 'No valido');
            res.redirect('/reestablecer')
        } else {
            usuario.token = null;
            usuario.token = null;
            usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10) );

            await usuario.save();
            req.flash('correcto', 'Tu password se ha modificado correctamente');
            res.redirect('/iniciar-sesion');
        }
        }
    }
}