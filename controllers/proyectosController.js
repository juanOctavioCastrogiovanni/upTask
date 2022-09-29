const Proyectos = require('../models/Proyecto')
const Tareas = require('../models/Tarea')


module.exports = {
    
    indexController : async (req,res) => {
        // Si no tenemos un estado en proyecto y queremos recuperar los proyectos incompletos
        // Proyectos incompletos SELECT *, COUNT(*) FROM tareas INNER JOIN proyectos ON tareas.proyectoId = proyectos.id AND proyectos.usuarioId=38 GROUP BY proyectoId,estado HAVING estado = 0;
    //    const proyectoIncompletos = Tareas.findAll({ 
    //         group: [
    //             'estado',
    //             'proyectoId'
    //         ], 
    //         having: {
    //             'estado': 0
    //         }, 
    //         include: [
    //             {
    //                 model: Proyectos,
    //                 where:{ usuarioId }
    //             }
    //         ]
    //     });

       
    //    const [proyectos,proyectosIncompletos] = await Promise.all([proyecto,proyectoIncompletos])
        const usuarioId = res.locals.usuario.id;
        const proyectos = await Proyectos.findAll({ where: { usuarioId } });
        const incompletos = proyectos.filter((proyecto) => proyecto.estado == 0)
        const completos = proyectos.filter((proyecto) => proyecto.estado == 1)
        
    
       res.render('index', {
           nombrePagina: "Proyectos",
           proyectos,
           proyectosTotales:proyectos.length,
           cantProyectosCompletos: completos.length,
           cantProyectosIncompletos:incompletos.length,
           usuarioId
        })
    },
    
    nuevoProyecto: async (req,res) => {
       const usuarioId = res.locals.usuario.id
       const proyectos = await Proyectos.findAll({ where: { usuarioId } });
       
       res.render('nuevoProyecto', {
           nombrePagina: "Nuevo Proyecto",
           proyectos
        })
    },
    
    datosFormulario: async (req,res) => {
       const usuarioId = res.locals.usuario.id
       const proyectos = await Proyectos.findAll({ where: { usuarioId } });
       // validar imput
       const {nombre} = req.body;
       
       const errores = [];
       
       if ( !nombre ){
           errores.push({'texto': 'w Nombre al Proyecto'});
        };
        
       if ( errores.length > 0 ) {
           res.render("nuevoProyecto",{
               nombrePagina : "Nuevo Proyecto",
               errores,
               proyectos
            })
       } else {
           await Proyectos.create({ nombre, usuarioId });
           res.redirect('/')
        }
    },
    
   detalleProyecto: async ( req,res ) => {
       const usuarioId = res.locals.usuario.id
       const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });
       const proyectoPromise  = Proyectos.findOne({ where: { url: req.params.url } });
       
       const [ proyecto, proyectos ] = await Promise.all([proyectoPromise, proyectosPromise]);

       const tareas = await Tareas.findAll({
           where: {
                proyectoId: proyecto.id
            }
       })

       res.render('tarea', {
           nombrePagina: "Detalle del proyecto",
           proyecto,
           proyectos,
           tareas,
           usuarioId
        })
    },
   
   formularioEditar: async ( req,res ) => {
       const usuarioId = res.locals.usuario.id
       const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });
       const proyectoPromise  = Proyectos.findOne({ where: { id: req.params.id } });

       const [ proyecto, proyectos ] = await Promise.all([proyectoPromise, proyectosPromise]);
       // validar imput
       

       res.render("nuevoProyecto",{
               nombrePagina : "Editar proyecto",
               proyectos,
               proyecto
           })
   },
   editarProyecto: async ( req,res ) => {
       const usuarioId = res.locals.usuario.id
       const proyectos = await Proyectos.findAll({ where: { usuarioId } });
       // validar imput
       const {nombre} = req.body;

       const errores = [];

       if ( !nombre ){
           errores.push({'texto': 'Agrega un Nombre al Proyecto'});
       };

       if ( errores.length > 0 ) {
           res.render("nuevoProyecto",{
               nombrePagina : "Nuevo Proyecto",
               errores,
               proyectos
           })
       } else {
           await Proyectos.update({ nombre }, {
               where: {
                   id:req.params.id
               }
           });
           res.redirect('/')
       }
   },
   eliminarProyecto: async ( req,res,next ) => {
       const {id} = req.query;

        // Borro todas las tareas asociadas a ese proyecto
        const borrarTareas = await Tareas.destroy( {where: {proyectoId: id}} );
        
        // Borro el proyecto finalmente
        const borrarProyecto = await Proyectos.destroy( {where: {id}} );
        
        // Si alguno de los 2 no se borro entonces no responde la peticion con status 200
       if( !borrarTareas || !borrarProyecto ) { return next(); }

       res.status(200).send('Proyecto eliminado correctamente');
   },
   cambiarEstado: async ( req,res,next ) => {
       const {estado,url} = req.params;

       let proyecto = await Proyectos.findOne({where:{url}});

       proyecto.estado = estado
       const resultado = await proyecto.save();
       if( !resultado ) {
           return next();
       }

       res.status(200).send('se cambio el estado del proyecto');
   }
}