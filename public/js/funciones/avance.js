import Swal from "sweetalert2";

export const avance = () => {
    const tareas           = document.querySelectorAll('li.tarea');
    const tareasRealizadas = document.querySelectorAll('i.completo');

    const porcentaje = Math.round((tareasRealizadas.length * 100) / tareas.length);

    const barra = document.querySelector('.porcentaje');
    barra.style.width = porcentaje + '%'
    if (porcentaje === 100 ){
        Swal.fire(
            'Completado!',
            'Tu lista de tareas ha sido completada',
            'success'
          )
    }
}