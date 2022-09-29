const Usuarios = require('../models/Usuario');
const crypto = require('crypto')
const { Op } = require("sequelize");
const bcrypt = require('bcrypt-nodejs');
const enviarCorreo = require('../handlers/email')

require('dotenv').config({path:'variables.env'})

module.exports = {
    formCrearCuenta: (req, res) => {

        res.render('crearCuenta', {
            nombrePagina : "Crear cuenta"
        })
    },
    formIniciarSesion: async(req, res) => {
        // let {nombre} = await Usuarios.findOne({where:{id:res.locals.usuario.id}})
        
        res.render('iniciarSesion', {
            nombrePagina : "Iniciar sesion en Uptask",
            // nombre
        })
    },
    crearCuenta: async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); // al cerrar sesión nos lleva al login
    })
        
        // leer los datos
    const { email, password, rePassword} = req.body;
    const expiracion = Date.now() + 3600000;
    const token = crypto.randomBytes(20).toString('hex');
    let usuario;
    
    

        if(rePassword != password){
            req.flash('error', ['La contraseña no son iguales']);
            // console.log(req.flash(), 'mensaje de flash')

            res.render('crearCuenta', {
                mensajes: req.flash(),
                nombrePagina : 'Crear Cuenta en Uptask', 
                email,
                password
            })
        }
        

        try {
            // crear el usuario
         usuario = await Usuarios.create({
                            email, 
                            password,
                            expiracion,
                            token,
                            activacion: 0
                        });
            
        } catch (error) {
 
            console.log('error de creacion')
            if(error.errors){
                req.flash('error', error.errors.map(error => error.message));
            } else {
                req.flash('error', 'Problemas de conexion con la base de datos, por favor comuniquese con su administrador');
            }
            
            // console.log(req.flash(), 'mensaje de flash')

            res.render('crearCuenta', {
                mensajes: req.flash(),
                nombrePagina : 'Crear Cuenta en Uptask', 
                email,
                password
            })
        }

        if(usuario) {
            const url = `http://${req.headers.host}/verificarUsuario/${token}`;

            //enviar por correo
            enviarCorreo.enviar({
               usuario,
               subject: 'Activa tu cuenta',
               confirmarUrl: url,
               archivo: 'confirmar-cuenta'
           }).then(console.log)

           req.flash('correcto', 'Exito, se ha enviado un correo electronico para activar la cuenta');
           // console.log(req.flash(), 'mensaje de flash')

           res.render('iniciarSesion', {
               mensajes: req.flash(),
               nombrePagina : 'Crear Cuenta en Uptask', 
               email,
               password
           })
           // crear una URL de confirmar

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
            
            const url = `http://${req.headers.host}/verificarUsuario/${usuario.token}`;

            //enviar por correo
            enviarCorreo.enviar({
                usuario,
                subject: 'Reestablesca el password',
                resetUrl: url,
                archivo: 'reestablecer-password'
            }).then(console.log)
            

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
            if(!usuario.activacion){
                    usuario.token = null;
                    usuario.expiracion = null;
                    usuario.activacion = 1;
        
                    await usuario.save();
                    req.flash('correcto', 'Tu cuenta ha sido activada');
                    res.redirect('/iniciar-sesion');
            }else {
                res.render('resetPassword', {
                    nombrePagina: 'Reestablecer contraseña',
                })
            }
        }
    },
    activarCuenta: async (req, res) => {
        const {token} = req.params
        const {password, rePassword} = req.body; 
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