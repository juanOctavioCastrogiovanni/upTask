const Proyectos = require('../models/Proyecto')
const Tareas = require('../models/Tarea')

module.exports = purgar = async () => {

    const proyectos = await Proyectos.findAll({
        attributes: ['id'],
        where: {usuarioId:2}
    })

    if(proyectos.length){

        // Convertime la respuesta en un array de id
        let proyectosIds = proyectos.map((proyecto) => {
            return proyecto.dataValues.id
        })

        
        // Borra cada tarea del proyecto tanto
        proyectosIds.forEach(id => {
            Tareas.destroy({
                where: {
                    proyectoId: id
                }
            })
        })
        

        // Borra finalmente el proyecto en cuestion        
        Proyectos.destroy({
            where: {
                usuarioId: 2
            }
        })
    
    }
}