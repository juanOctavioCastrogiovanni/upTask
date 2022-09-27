import axios from 'axios';
import Swal from 'sweetalert2';
// const axios = require('axios').default;
// alert('proyectos')const btnEliminar = document.querySelector('#eliminar-proyecto');


const btnEliminar = document.querySelector('#eliminar-proyecto');



if (btnEliminar) {
    btnEliminar.addEventListener('click', (event) => {
       const id = event.target.dataset.id;
       
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
          
           const url = `${location.origin}/proyectos/${id}`;

           axios.delete(url, {
               params: {id}
           }).then(respuesta => {
               
           console.log(respuesta);
               
           Swal.fire(
               'Borrado!',
               respuesta.data,
               'Exitoso'
            ).then(() => {
                window.location.href = '/';
            })
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

export default btnEliminar;