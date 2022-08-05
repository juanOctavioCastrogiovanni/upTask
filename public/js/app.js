import axios from 'axios';
import Swal from 'sweetalert2';
// const axios = require('axios').default;

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
     btnEliminar.addEventListener('click', (event) => {
        const urlProyecto = event.target.dataset.proyectoUrl;

        Swal.fire({
        title: 'Deseas borrar este proyecto?',
        text: "Un proyecto eliminado no se puede recuperar!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Borralo!',
        cancelButtonColor: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
           
            const url = `${location.origin}/proyectos/${urlProyecto}`;
            axios.delete(url, {
                params: {urlProyecto}
            }).then(respuesta => {
                
            console.log(respuesta);
                
            Swal.fire(
                'Borrado!',
                respuesta.data,
                'Exitoso'
                )
           

          setTimeout(() => {
              window.location.href = '/';
          }, 3000)
        })
        .catch(() => {
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: "No se pudo eliminar el proyecto."
            })
        })
        }
    }) 
})
}