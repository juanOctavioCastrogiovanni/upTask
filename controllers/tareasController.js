 const Proyectos = require('../models/Proyecto');
 const Tareas = require('../models/Tarea');
 
 module.exports = {
    agregarTarea: async (req, res, next) => {
        const ProyectoActual = await Proyectos.findOne({
            where:{
                url: req.params.url
            }
        })

        // const tarea = req.body,tarea
        const {tareas} = req.body;
        const estado  = 0;
        const {id} = ProyectoActual;
        
        console.log(tareas,estado,id)

        const resultado = await Tareas.create({
            tareas,
            estado,
            proyectoId:id
        })

        if(!resultado){
            return next();
        }
        res.redirect(`/proyectos/${req.params.url}`)
    }

 }