const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyecto');
const bcrypt = require('bcrypt-nodejs');

const Usuario = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
         type: Sequelize.STRING(60),
         allowNull:false,
         validate: {
            isEmail: {
                msg: 'Agrega un Correo Válido'
            },
            notEmpty: {
                msg: 'No puedes colocar un correo vacio'
            }
         },
         unique: {
            args:true,
            msg: 'Usuario ya registrado'
         }
    },
    password:{
        type: Sequelize.STRING(60),
        allowNull:false,
        validate: {
            notEmpty: {
                msg: 'No puedes colocar un password vacio'
            }
         }
   }
}, {
    hooks: {
        beforeCreate( usuario ) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
        }
    }
})
// Métodos personalizados
Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

Usuario.hasMany(Proyectos);

module.exports = Usuario;