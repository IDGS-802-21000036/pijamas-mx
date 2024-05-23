
let galletas = document.getElementById('graficaGalletas').getContext('2d');
let ventas = document.getElementById('graficaVentas').getContext('2d');

// Utilizar los datos de galletaVendida en tu script JavaScript
$(document).ready(function() {
    // Crear arrays para almacenar los datos de las galletas más vendidas
    let galletasLabels = [];
    let galletasData = [];

    // Iterar sobre los datos y agregarlos a los arrays
    galletaVendida.forEach(function(detalle) {
        galletasLabels.push(detalle.nombre_galleta);
        galletasData.push(detalle.cantidad);
    });

    // Obtener el contexto del elemento canvas para la gráfica de galletas
    let galletasCtx = document.getElementById('graficaGalletas').getContext('2d');

    // Crear la gráfica de galletas más vendidas
    let galletasChart = new Chart(galletasCtx, {
        type: 'bar',
        data: {
            labels: galletasLabels,
            datasets: [{
                label: "Galleta",
                backgroundColor:'rgba(14, 34, 56, 1)',
                borderColor:'rgba(14, 34, 56, 1)',
                borderWidth: 2,
                data: galletasData
            }]
        }
    });
});

// Utilizar los datos de ventasDia en tu script JavaScript
$(document).ready(function() {
    // Crear arrays para almacenar los datos de ventas por día
    let ventasLabels = [];
    let ventasData = [];

    // Iterar sobre los datos y agregarlos a los arrays
    ventasDia.forEach(function(detalle) {
        ventasLabels.push(detalle.fecha);
        ventasData.push(detalle.ventas_dia);
    });

    // Obtener el contexto del elemento canvas para la gráfica de ventas
    let ventasCtx = document.getElementById('graficaVentas').getContext('2d');

    // Crear la gráfica de ventas por día
    let ventasChart = new Chart(ventasCtx, {
        type: 'bar',
        data: {
            labels: ventasLabels,
            datasets: [{
                label: "Día",
                backgroundColor: 'rgba(14, 34, 56, 1)',
                borderColor:'rgba(14, 34, 56, 1)',
                borderWidth: 2,
                data: ventasData
            }]
        }
    });
});












