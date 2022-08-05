const Sequelize = require('sequelize');
const db = require('../config/db');

const Tarea = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tareas: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
})

module.exports = Tarea;