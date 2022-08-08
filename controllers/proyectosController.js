const Proyectos = require('../models/Proyecto')
const Tareas = require('../models/Tarea')
 
module.exports = {

   indexController : async (req,res) => {
       const proyectos = await Proyectos.findAll();
       
       // res.send(proyectos)
       
       res.render('index', {
           nombrePagina: "Proyectos",
           proyectos
       })
   },
   
   nuevoProyecto: async (req,res) => {
       const proyectos = await Proyectos.findAll();
       res.render('nuevoProyecto', {
           nombrePagina: "Nuevo Proyecto",
           proyectos
       })
   },
   
   datosFormulario: async (req,res) => {
       const proyectos = await Proyectos.findAll();
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
           await Proyectos.create({ nombre });
           res.redirect('/')
       }
   },
    
   detalleProyecto: async ( req,res ) => {
       const proyectosPromise = Proyectos.findAll();
       const proyectoPromise  = Proyectos.findOne({
           where: {
               url: req.params.url
           }
       });

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
           tareas
       })
   },
   
   formularioEditar: async ( req,res ) => {
       const proyectosPromise = Proyectos.findAll();
       const proyectoPromise  = Proyectos.findOne({
           where: {
               id: req.params.id
           }
       });

       const [ proyecto, proyectos ] = await Promise.all([proyectoPromise, proyectosPromise]);
       // validar imput
   

           res.render("nuevoProyecto",{
               nombrePagina : "Editar proyecto",
               proyectos,
               proyecto
           })
   },
   editarProyecto: async ( req,res ) => {
       const proyectos = await Proyectos.findAll();
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
   eliminarProyecto: async ( req,res ) => {
       const {urlProyecto} = req.query;

       let resultado = await Proyectos.destroy( {
           where: { 
               url: urlProyecto
           }
       });

       if( !resultado ) {
           return next();
       }

       res.status(200).send('Proyecto Eliminado Correctamente');
   }

}