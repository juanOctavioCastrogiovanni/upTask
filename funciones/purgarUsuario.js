const Proyectos = require('../models/Proyecto')
const Tareas = require('../models/Tarea')

module.exports = purgar = async (id) => {
    
    if(id===2) { 
        const proyectos = await Proyectos.findAll({
            attributes: ['id'],
            where: {usuarioId:id}
        })
        let proyectosIds = proyectos.map((proyecto) => {
            return proyecto.dataValues.id
        })

        proyectosIds.forEach(id => {
             Tareas.destroy({
                where: {
                    proyectoId: id
                }
            })
        });

        Proyectos.destroy({
            where: {
                usuarioId: id
            }
        })


    }
}