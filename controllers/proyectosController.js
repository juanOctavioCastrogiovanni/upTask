 const Proyectos = require('../models/Proyecto')
 
 module.exports = {

    indexController : (req,res) => {
        res.render('index', {
            nombrePagina: "Proyectos"
        })
    },

    nuevoProyecto: (req,res) => {
        res.render('nuevoProyecto', {
            nombrePagina: "Nuevo Proyecto"
        })
    },
   
    datosFormulario: async (req,res) => {
        // validar imput
        const {nombre} = req.body;

        const errores = [];

        if ( !nombre ){
            errores.push({'texto': 'Agrega un Nombre al Proyecto'});
        };

        if ( errores.length > 0 ) {
            res.render("nuevoProyecto",{
                nombrePagina : "Nuevo Proyecto",
                errores
            })
        } else {
            const proyecto = await Proyectos.create({ nombre });
            res.redirect('/')
        }
    }

 }