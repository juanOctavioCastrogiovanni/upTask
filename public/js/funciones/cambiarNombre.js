import axios from "axios";

export const cambiarNombre = (id,elemento,nombre,bandera,obj) => {
    console.log(id, elemento.target, nombre)
    const url = `${location.origin}/proyectos/tarea/nombre/${id}/${nombre}`;
    axios.patch(url, { 
        id
    })
    .then(respuesta => {
        if(respuesta.status === 200){
            let p = document.createElement("p");
            p.innerText = nombre;
            p.setAttribute("class", "texto-lista");
            let i = (bandera)? elemento.target.querySelector('input') : elemento.target;
            (bandera) ? elemento.target.insertBefore(p, i) : elemento.target.parentElement.insertBefore(p, i) 
            i.remove()
            obj.bandera = false
        }
    })
    .catch(msg => console.log(msg))
}