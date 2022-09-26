// Esta es la configuracion de la estadistica principal
import Chart from 'chart.js'

// Defino los valores de tareas totales, incompletas y completas
const valores = document.getElementById('myChart').innerHTML;
const [totales,incompletos, completos] = valores.split('-');



const data = {
    labels: [
      'Proyectos completados',
      'Proyectos incompletos',
    ],
    // Los nombres de las barras
    datasets: [{
      label: 'Estadisticas de proyectos',
      data: [
        Number(completos), 
        Number(incompletos)
    ],
    // los colores
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
      ],
      hoverOffset: 4
    }]
  };

// Defino el maximo y el minimo
const options = {
    scales: {
        yAxes: [{
            ticks: {
                max: Number(totales),
                min: 0,
                stepSize: 1
            }
        }]
    }
};


var ctx = document.getElementById('myChart').getContext('2d');
var myBarChart = new Chart(ctx, {
    // Le digo que es un grafico de barra
    type: 'bar',
    // Que utiliza data como objeto de configuracion
    data:data,
    // Que utiliza option options objeto de options
    options:options
});


