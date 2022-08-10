import axios from "axios";

export const cambiarNombre = (id,elemento,nombre,bandera,obj) => {
    // Esta funcion lo que hace es teniendo el nombre capturado por el input, manda una peticion patch por axios
    // y si la respuesta es positiva, elimina el input y crea un p con el nuevo nombre

    const url = `${location.origin}/proyectos/tarea/nombre/${id}/${nombre}`;
    axios.patch(url, { 
        id
    })
    .then(respuesta => {
        if(respuesta.status === 200){
            // crea una etiqueta p
            let p = document.createElement("p");
            // le coloca el contenido
            p.innerText = nombre;
            // le agrega una clase a esa etiqueta
            p.setAttribute("class", "texto-lista");
            // selecciona el i presente
            // si la bandera es verdadera ese input se encuentra dentro del elemento del evento
            // si no significa que es el mismo elemento del evento
            // esto es porque esta funcion se ejecuta en 2 ambitos de eventos diferente y depende cual 
            // el imput se encuentra en diferentes lados
            let i = (bandera)? elemento.target.querySelector('input') : elemento.target;
            (bandera) ? elemento.target.insertBefore(p, i) : elemento.target.parentElement.insertBefore(p, i) 
            // remueve el input seleccionado
            i.remove()
            // la bandea la cambia a false 
            obj.bandera = false
        }
    })
    .catch(msg => console.log(msg))
}