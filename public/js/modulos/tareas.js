import axios from 'axios'
import Swal from 'sweetalert2'

const check = document.querySelector(".listado-pendientes");


if(check){
    check.addEventListener('click', elemento => {
        let icono;
        let id;

        if(elemento.target.classList.contains("fa-check-circle")){
            icono = elemento.target
            id = icono.parentElement.parentElement.dataset.tarea;
            const url = `${location.origin}/proyectos/tarea/estado/${id}`;

            axios.patch(url, {
                id
            }).then(respuesta => {
                if(respuesta.status === 200){
                    icono.classList.toggle('completo');
                }
            })
            .catch(msg => console.log(msg))

        }

        if(elemento.target.classList.contains("fa-trash")){
            icono = elemento.target
            id = icono.parentElement.parentElement.dataset.tarea;
            const borrarElemento = icono.parentElement.parentElement;
            
           const url = `${location.origin}/proyectos/tarea/borrar/${id}`;

           Swal.fire({
            title: '¿Esta a punto de borrar esta tarea?',
            text: "Recuerde que no puede revertirlo!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Borrar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(url,{
                    id
                }).then(respuesta => {
     
                    console.log(respuesta)
                 if(respuesta.status === 200){
                     borrarElemento.remove();
                     if(respuesta.data < 1) {
                         let p = document.createElement("p")
                         p.innerText = 'No hay tareas en este proyecto';
                         check.appendChild(p);
                     }
                 }
                }) .catch(msg => console.log(msg))
             Swal.fire(
                'Borrado!',
                'Su archivo ha sido borrado',
                'success'
              )
            }
          })




           
           
        }
    })
}

export default check;