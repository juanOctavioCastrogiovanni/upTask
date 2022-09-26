import axios from 'axios'
import Swal from 'sweetalert2'
import {avance} from '../funciones/avance'
import Sortable from 'sortablejs';
import {ejecutarCambioNombre} from "../funciones/ejecutarCambioNombre";

import('./estadisticas.js').then(module => module.func());


const check = document.querySelector(".listado-pendientes");
const lista = document.querySelector(".listado-pendientes>ul");
const botonOrdenado = document.querySelector(".fas.fa-list-ul");
const acciones = document.querySelectorAll(".acciones");
const body = document.querySelector("body");
const preloader = document.getElementById("preloader");

let nombre;
// Este booleano permite saber si esta activada la funcion de ordenamiento
let ordenar = false




//libreria que permite ordenar items de una lista con drag and drop
 new Sortable(lista, {
    // Handle permite solo ordenar por icono 
    handle: '.fas.fa-arrows-alt',
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




// Evento que se encarga de cambiar el icono de las acciones de check y trash con el de las flechas para ordenarlo
// Si existe
if(botonOrdenado){
    // Lanza el evento
    botonOrdenado.addEventListener('click', () => {
        // Si no esta activada la funcion de ordenamiento
        if(!ordenar){
            let accion;
            let icon;

            // Recorre todos los li y modifica el div de acciones de cada uno (el div de acciones contienen los botones de trash y check)
            for(let i = 0; i < acciones.length ; i++){
                accion = acciones[i].querySelectorAll("i")
                // En este caso vuelve a recorrer cada uno de los iconos "i" que se encuentra dentro de cada "acciones", esto es porque hay 2 iconos. Tambien 
                // se podria haber hecho sin for porque solo son 2 iconos pero es mas flexible.
                for(let j = 0; j < accion.length; j++ ){
                    // Oculto estos iconos
                    accion[j].style.display="none";
                }

                // Creo un icono nuevo 
                icon = document.createElement('i');
                // Agrego a este icono creado la etiqueta fas y luego la etiqueta "fa-arrows-alt"
                icon.classList.add('fas');
                icon.classList.add('fa-arrows-alt');
                // inserto este icono dentro de acciones iterada
                acciones[i].appendChild(icon);
            }
            // Cambio la bandera en true, porque ahora si estoy ordenando la lista, si vuelvo ejecutar el evento no va entrar por aqui, sino que por el else.
            ordenar = true;

        } else {
            // Esto significa que mi accion ahora es salir de la funcion ordenar, el usuario quiere volver a ver los iconos de trash y check
            // Entonces debo recorrer nuevamente todos los div acciones, dentro de cada li
            for(let i = 0; i < acciones.length ; i++){
                // Ahora quiero volver a mostrar los iconos trash y check que habia ocultado anteriormente y remover el icono que habia creado
                acciones[i].querySelectorAll("i")[0].style.display="inline-block";
                acciones[i].querySelectorAll("i")[1].style.display="inline-block";
                acciones[i].querySelectorAll("i")[2].remove() 
            }               
            // Cambio la bandera a false, porque si quiero volver a ingresar al evento quiero ordenar nuevamente. Esto hara que !ordenar sea verdadero
            ordenar = false;
        }
    })
}





// un pequeño array que tiene en la primera posicion la bandera de evento y en la segunda el id de tarea
// lo hice como un arreglo ya que js no soporta argumentos por referencia
let arr = [false, 0]


// let bandera = false


// Si estoy en la pagina correcta y capturo la etiqueta listado-pendiente
if(check){

    // si hago click en la lista de tareas
    check.addEventListener('click', elemento => {
        let icono;
        let id;
        // a partir de aca se utiliza desestructuracion es decir en un mismo evento de un div padre dependiendo la clase
        // se que el usuario quiere hacer una accion u otra
        
        // si hago click en el nombre de la tarea, significa que el usuario quiere modificar el nombre de la tarea, esto hara que aparezca un input 
        if(elemento.target.classList.contains("texto-lista") && !arr[0]){
            // Cambio la bandera en true, sino voy a crear distintos input en otros li al mismo tiempo
            arr[0] = true;

            // creo un nuevo elemento input

            let i = document.createElement("input");

            // le configuro los atributos del elemento input, debe tener el nombre por defecto que estaba por eso lo saco del elemento ya capturado en el evento

            i.value = elemento.target.innerText
            i.setAttribute("class", "lista-entrada");
            

            // Configuro la variable nombre donde se almacenara el nombre que viene por defecto en el formulario (nombre anterior)

            nombre = elemento.target.innerText;
            
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
            i.focus()

            p.remove();         
            
            // de esta manera el usuario puede escribir en el input el nombre de la nueva tarea
            // almaceno el id de la tarea en el arreglo creado de manera global, esto lo podemos lograr porque en 
            // la etiqueta almacenamos el id en el atributo data-tarea
            arr[1] = i.parentElement.dataset.tarea


            // Bien ahora para poder almacenar el nuevo nombre, en este caso cree 2 eventos. Si el usuario escribe y coloca "enter" debe guardarlo en la base 
            // de datos, o bien el usuario selecciona cualquier otro lugar que no sea el input debe hacer lo mismo.

            let keybool = false;

            i.addEventListener( 'keydown' , (el) => {
                // Si el usuario selecciono enter
                if(el.key == 'Enter'){
                    // En este caso si yo aprieto el boton de "enter cambia la bandera a true y no se puede ejecutar el cambio de nombre 2 veces"
                    keybool = true;
                    ejecutarCambioNombre(el,arr,nombre);
                }
                
                keybool = false;
                
            });

            
            // cambio la bandera en true
            // de esta forma evito se realicen 2 eventos anidados 
            

            // Si nunca toco enter entonces el usuario puede activar el evento blur
            i.addEventListener('blur', (el) => {
                if(!keybool){
                    ejecutarCambioNombre(el,arr,nombre);
                }
            })
        }

       

        // En el caso de que se clickee en el check de tarea terminada
        if(elemento.target.classList.contains("fa-check-circle")){
            
            // Ejecuto la animacion del preloader
            preloader.classList.remove('none')
            preloader.classList.add('load')
            body.classList.add('preloader')
            
            // selecciono el icono 
            icono = elemento.target

            // capturo el id de la tarea para armar la url
            id = icono.parentElement.parentElement.dataset.tarea;

            // Armo la url para la api
            const url = `${location.origin}/proyectos/tarea/estado/${id}`;
            
            // hago una peticion patch con axios para que haya una comunicación con el back 
            axios.patch(url, {
                id
            }).then(respuesta => {
                // Si la respuesta es 200 de estatus, es decir, es correcta
                if(respuesta.status === 200){
                    // Corto la animacion
                    preloader.classList.remove('load')
                    preloader.classList.add('none')
                    body.classList.remove('preloader')

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
            // selecciono el icono 
            icono = elemento.target

            // capturo el borrar elemento
            const borrarElemento = icono.parentElement.parentElement;
            
            // capturo el id de la tarea para armar la url
            id = icono.parentElement.parentElement.dataset.tarea;
            
            // Armo la url para la api
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
              }, 1000)
              
            }
          })




           
           
        }
    })
}

export default check;


