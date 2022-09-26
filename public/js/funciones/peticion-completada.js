
import axios from "axios";        
import Swal from "sweetalert2";        
import { cambiarColor } from "./cambiarColor";

// Esta funcion realiza una peticion axios donde como respuesta si el estado es 1, significa que el proyecto esta completado 
// tambien hace saltar la alerta de proyecto completado
export const completada = (estado,urlId) => {
        const url = `${location.origin}/proyectos/estado/${urlId}/${estado}`;
        axios.patch(url)
        .then(respuesta => {
            if(respuesta.status === 200 && estado){
                Swal.fire({
                    icon: 'success',
                    title: 'Genial',
                    text: "El proyecto se ha completado",
                })
                .then(res=> {
                    if(res.isConfirmed){
                        // Si confirmo me lleva a la pagina principal
                        window.location.href = '/';
                    }
                    // Si selecciono cualquier otro lugar me quedo en la pagina de tareas
                })
                // cambiarColor es una funcion con 2 parametros, el primero es un booleano si el proyecto esta completo o no y el segundo
                // el id del proyecto en cuestion en cuaestion, segun esto cambia o no tachando el nombre
                cambiarColor(true,urlId)     
            } else if(respuesta.status === 200){
                cambiarColor(false,urlId)
            }
        })
        .catch(msg => console.log(msg))
}

