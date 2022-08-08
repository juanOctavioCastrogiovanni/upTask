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
        const {tarea} = req.body;
        const estado  = 0;
        const {id} = ProyectoActual;
        
        console.log(tarea,estado,id)

        const resultado = await Tareas.create({
            tareas:tarea,
            estado,
            proyectoId:id
        })

        if(!resultado){
            return next();
        }
        res.redirect(`/proyectos/${req.params.url}`)
    },

    cambiarEstado: async (req, res, next) => {
       const tarea = await Tareas.findOne({
           where : {
               id:req.params.id
           }
       })

       let estado = 0;
       if(estado === tarea.estado){
           estado = 1;
       }

       tarea.estado = estado

       const resultado = await tarea.save();

       if(!resultado) return next(); 

       res.status(200).send('modificado');

    },
    eliminarTarea: async (req, res, next) => {
        const { id, proyectoId } = await Tareas.findOne({
            where : {
                id:req.params.id
            }
        })

        const tareas = await Tareas.findAll({ where : { proyectoId }})

        const cantidad = (tareas.length-1).toString();

        let resultado = await Tareas.destroy({ where: { id }})

        if(!resultado) return next();
        
        res.status(200).send(cantidad)
    }

 }