import axios from 'axios'

const preloader = document.getElementById("preloader");
const body = document.querySelector("body");

export const ejecutarCambioNombre = (el,arr,nombre) => {
    // Si no escribo nada en el input, significa que el valor del input es el mismo que el que esta escrito 

    if(el.target.value!= nombre){

        // Creo las etiquetas para activar el preloader mientras espero la respuesta de la primesa del axios

        preloader.classList.remove('none')
        preloader.classList.add('load')
        body.classList.add('preloader')

        // En este caso ejecuto la funcion cambiarNombre, que es una api que me permite cambiar el nombre en la base de datos
        // cambiarNombre tiene 2 parametros, el id de la tarea (que es la segunda posicion del arreglo) y el nuevo nombre de la misma
        cambiarNombre(arr[1],el.target.value)

        // Luego ejecuto la funcion que borra el input ya que no lo necesito y el nuevo nombre lo coloca en una etiqueta p
        // quita

        // quitarInput tiene 3 paramentros, el elemento en cuestion, el nuevo nombre o el viejo nombre y un arreglo
        
        quitarInput(el, el.target.value, arr);
    } else {
        quitarInput(el, nombre, arr);
    }
}




const cambiarNombre = (id,nombre) => {
    // Esta funcion lo que hace es teniendo el nombre capturado por el input, manda una peticion patch por axios
    // y si la respuesta es positiva, elimina el input y crea un p con el nuevo nombre

    const url = `${location.origin}/proyectos/tarea/nombre/${id}/${nombre}`;
    axios.patch(url, { 
        id
    })
    .then(respuesta => {
        if(respuesta.status === 200){
            preloader.classList.remove('load')
            preloader.classList.add('none')
            body.classList.remove('preloader')
            
        }
    })
    .catch(msg => console.log(msg))
}





const quitarInput = (elemento, nombre, arr) => {
    // crea una etiqueta p
    let p = document.createElement("p");
    // le coloca el contenido
    p.innerText = nombre;
    // le agrega una clase a esa etiqueta
    p.setAttribute("class", "texto-lista");
    // selecciona el i presente
    let i = elemento.target;
    // inserta el p antes que el i, toma como referencia el div padre que seria el li.
    elemento.target.parentElement.insertBefore(p, i);
    // remueve el input seleccionado
    i.remove();
    // cambio la bandera para dar la posibilidad al usuario de cambiar el nombre de cualquier otra tarea de la lista
    arr[0] = false;
}