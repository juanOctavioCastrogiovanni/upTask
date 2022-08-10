import axios from 'axios'
import Swal from 'sweetalert2'
import {avance} from '../funciones/avance'
import Sortable from 'sortablejs';
import {cambiarNombre} from '../funciones/cambiarNombre'


const check = document.querySelector(".listado-pendientes");
const lista = document.querySelector(".listado-pendientes>ul");
let nombre;

// un pequeño objeto que permite verificar la acción del cliente a la hora de cambiar el nombre
let obj = {
    booleano: false,
    id: 0
};

// let bandera = false

//libreria que permite ordenar items de una lista con drag and drop
Sortable.create(lista, {
	animation: 150,  
    ghostClass: "sortable-ghost",  
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

// Si estoy en la pagina correcta y capturo la etiqueta listado-pendiente
if(check){

    // si hago click en la lista de tareas
    check.addEventListener('click', elemento => {
        let icono;
        let id;
        // a partir de aca se utiliza desestructuracion es decir en un mismo evento de un div padre dependiendo la clase
        // se que el usuario quiere hacer una accion u otra
        
        // si hago click en el nombre de la tarea
        if(elemento.target.classList.contains("texto-lista") && !obj.bandera){
            // creo un nuevo elemento input
            let i = document.createElement("input");
            // le configuro los atributos del elemento input, debe tener el nombre por defecto que estaba por eso lo saco del elemento ya capturado en el evento
            i.setAttribute("placeholder", elemento.target.innerText);
            i.setAttribute("class", "lista-entrada");
            
            // ahora capturo la etiqueta p que la saco del elemento del evento
            let p = elemento.target;
            /*Teniendo en cuenta que tengo la etiqueta input creada y tengo al mismo tiempo 
            el elemento p que ya estaba (es el que hice click antes) ahora utilizo el metodo 
            insertBefore que lo que hace es teniendo 
            la etiqueta padre que es elemento.target.parentElement inserto antes del p el y
            es decir
            <div>
                <input> (inserto este input que no existia antes que el p)
                <p></p>
            </div>
            */
            elemento.target.parentElement.insertBefore(i, p);
            // remuevo el p ya que no sirve
            p.remove();         
            
            // de esta manera el usuario puede escribir en el input el nombre de la nueva tarea
            // almaceno el id de la tarea en el objeto creado de manera global
            obj.id = i.parentElement.dataset.tarea
            
            // con ese input creado creo un evento de tecla con 2 finalidades, la primera es almacenar lo que se coloco en el input, y 
            // la segunda es leer cada letra y cuando se preciona el Enter ejecutar la funcion que cambia el nombre
            i.addEventListener('keydown', (el) => {
                nombre = el.target.value     
                if(el.key == 'Enter'){
                    cambiarNombre(obj.id,el,nombre,false,obj)
                }
            });

            // si no se guardo nada en nombre, es decir no se preciono ninguna tecla
            // almacena lo que ya habia en el placeholder
            if (!nombre){
                nombre = elemento.target.innerText
            }

            // cambio la bandera en true
            // de esta forma evito se realicen 2 eventos anidados indeciados 
            obj.bandera = true;
            // console.log(i.parentElement)
        }

        // ahora si selecciono fuera del p dentro del mismo li de tareas, tengo la bandera en true y 
        // el id de esa tarea corresponde al id seteado anteriormente 
        // este ultimo es para evitar que se creen etiquetas p en otras tareas que no sean la tarea misma seleccionada
        // anteriormente
        if(elemento.target.classList.contains("tarea")  && obj.bandera && obj.id === elemento.target.dataset.tarea) {
            // ejecuto cambiar nombre, una funcion que crea un p con el mismo nombre, elimina el input 
            // ya que a estas alturas el usuario ya digito el nuevo nombre de la tarea
            // y manda una peticion patch por axios a la ruta encargada de cambiar el nombre
            cambiarNombre(obj.id,elemento,nombre,true,obj)
        }
        

        // En el caso de que se clickee en el check de tarea terminada
        if(elemento.target.classList.contains("fa-check-circle")){
            // capturo el id de la tarea para armar la url
            icono = elemento.target
            id = icono.parentElement.parentElement.dataset.tarea;
            const url = `${location.origin}/proyectos/tarea/estado/${id}`;

            // hago una peticion patch con axios para que haya una comunicación con el back 
            axios.patch(url, {
                id
            }).then(respuesta => {
                // Si la respuesta es 200 de estatus, es decir, es correcta
                if(respuesta.status === 200){
                    // le agrego la clase completo o la quito dependiendo si la tiene o no
                    icono.classList.toggle('completo');
                    // ejecuto la funcion avance que maneja el porcentaje de la barra de completados
                    avance();
                }
            })
            .catch(msg => console.log(msg))

        }
        // Si el usuario hizo click en el basurero
        if(elemento.target.classList.contains("fa-trash")){
            icono = elemento.target
            id = icono.parentElement.parentElement.dataset.tarea;
            const borrarElemento = icono.parentElement.parentElement;
            
            const url = `${location.origin}/proyectos/tarea/borrar/${id}`;
            
            // utilizo el metodo fire de sweetalert2 para la alerta
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
            // si el usuario selecciono borrar
            if (result.isConfirmed) {
                // se hace una peticion a la url para borrar la tarea
                axios.delete(url,{
                    id
                }).then(respuesta => {
                    
                    // si se borro en la base de datos, es decir el estatus de la respuesta es 200
                    if(respuesta.status === 200){
                        // remuevo el elemento 
                        borrarElemento.remove();
                        // En caso que el numero de tareas enviado por la base de datos sea menor a 1 
                        if(respuesta.data < 1) {
                        // crear un p que diga no hay tareas
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

            //   si se borro una tarea ejecutar nuevamente la funcion que mueve la barra
              setTimeout( () => {
                avance();
              }, 2000)
              
            }
          })




           
           
        }
    })
}

export default check;


