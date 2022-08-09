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
         allowNull:false
    },
    password:{
        type: Sequelize.STRING(60),
        allowNull:false
   }
}, {
    hooks: {
        beforeCreate( usuario ) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
        }
    }
})

Usuario.hasMany(Proyectos);

module.exports = Usuario;