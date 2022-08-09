import axios from 'axios'
import Swal from 'sweetalert2'
import {avance} from '../funciones/avance'
import Sortable, { ghost } from 'sortablejs';


const check = document.querySelector(".listado-pendientes");
const lista = document.querySelector(".listado-pendientes > ul")

let bandera = false;

Sortable.create(lista, {
	animation: 150,  
    ghostClass: "sortable-ghost",  // Class name for the drop placeholder
	// chosenClass: "sortable-ghost",  // Class name for the chosen item
	// dragClass: "sortable-ghost",
    store: {
        get: function (sortable) {
			var order = localStorage.getItem(sortable.options.group.name);
			return order ? order.split('|') : [];
		},
		set: function (sortable) {
			var order = sortable.toArray();
			localStorage.setItem(sortable.options.group.name, order.join('|'));
        }
	}
});


if(check){
    check.addEventListener('click', elemento => {
        let icono;
        let id;
        
        if(!elemento.target.classList.contains("texto-lista")){
            var p = document.createElement("p");
            console.log(elemento)
            // p.setAttribute("placeholder", elemento.target.innerText);
            // p.setAttribute("class", "texto-lista");
            // // Obtener una referencia al nodo padre
            // var p = elemento.target;
            // // Inserta un nuevo elemento en el DOM antes de sp2
            // elemento.target.parentElement.insertBefore(i, p);
            // p.remove();
            
            
            
            
            // let i = document.createElement("input");
            // i.setAttribute("placeholder", elemento.target.innerText);
            // elemento.target.innerText=''
            // elemento.target.appendChild(i);
            // elemento.target.remove()
            // bandera = true;
            // console.log(bandera)
        }
        
        if(elemento.target.classList.contains("texto-lista")){
            var i = document.createElement("input");
            i.setAttribute("placeholder", elemento.target.innerText);
            i.setAttribute("class", "lista-entrada");
            // Obtener una referencia al nodo padre
            var p = elemento.target;
            // Inserta un nuevo elemento en el DOM antes de sp2
            elemento.target.parentElement.insertBefore(i, p);
            p.remove();
            
            
            
            
            // let i = document.createElement("input");
            // i.setAttribute("placeholder", elemento.target.innerText);
            // elemento.target.innerText=''
            // elemento.target.appendChild(i);
            // elemento.target.remove()
            // bandera = true;
            // console.log(bandera)
        }


        if(elemento.target.classList.contains("fa-check-circle")){
            icono = elemento.target
            id = icono.parentElement.parentElement.dataset.tarea;
            const url = `${location.origin}/proyectos/tarea/estado/${id}`;

            axios.patch(url, {
                id
            }).then(respuesta => {
                if(respuesta.status === 200){
                    icono.classList.toggle('completo');
                    avance();
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

              setTimeout( () => {
                avance();
              }, 2000)
              
            }
          })




           
           
        }
    })
}

export default check;