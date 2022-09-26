import {completada} from "./peticion-completada"

export const avance = () => {
    const tareas           = document.querySelectorAll('li.tarea');
    const tareasRealizadas = document.querySelectorAll('i.completo');
    const url = window.location.pathname.split('/')[2]
    

    const porcentaje = Math.round((tareasRealizadas.length * 100) / tareas.length);

    const barra = document.querySelector('.porcentaje');
    barra.style.width = porcentaje + '%';
    
    barra.innerHTML = '&nbsp&nbsp' + porcentaje + '%';
    // manda la peticion a la ruta para que cambie el estado de completado en el proyecto
    barra.style.color = (porcentaje != 0) ?  "white" : "black"; 
    (porcentaje == 100 ) ? completada(1,url) : completada(0,url);
}