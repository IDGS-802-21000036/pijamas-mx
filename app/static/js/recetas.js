// Inicializa la tabla con DataTables
var table = $('#tblReceta').DataTable({
    lengthChange: true,
    pageLength: 10,
    responsive: true,
    columnDefs: [
        { responsivePriority: 1, targets: 0, className: 'all' },
        { responsivePriority: 2, targets: 1, className: 'all' },
        { responsivePriority: 3, targets: 2, className: 'desktop' },
        { responsivePriority: 4, targets: 3, className: 'desktop' },
        { responsivePriority: 5, targets: 4, className: 'all' },
        { responsivePriority: 6, targets: 5, className: 'all' },
    ]
});

document.getElementById('addReceta').addEventListener('click', function() {
    var selectHTML = '';
    galletas.forEach(galleta => {
        selectHTML += '<option value="' + galleta.id + '">' + galleta.nombre_galleta + '</option>';
    });

    Swal.fire({
        title: 'Nueva Receta',
        html: `
            <input class="form-control mb-3" id="swalnombre" placeholder="Nombre">
            <input class="form-control mb-3" id="swaldescripcion" placeholder="Descripcion">
            <input class="form-control mb-3" id="swalcantidad" placeholder="Cantidad">
            <select class="form-control mb-3" id="swalidgalleta">
                ${selectHTML}
            </select>`,
        confirmButtonText: 'Guardar',
        focusConfirm: false,
        preConfirm: () => {
            const id = 0;
            const nombre_receta = document.getElementById('swalnombre').value;
            const descripcion = document.getElementById('swaldescripcion').value;
            const cantidad_produccion = document.getElementById('swalcantidad').value;
            const id_galleta = document.getElementById('swalidgalleta').value;

            if (!nombre_receta || !descripcion || !cantidad_produccion || !id_galleta) {
                Swal.showValidationMessage('Por favor, rellene todos los campos');
                return false;
            }

            // Llenar el formulario oculto con los datos recogidos
            document.getElementById('hiddenId').value = id;
            document.getElementById('nombre_receta').value = nombre_receta;
            document.getElementById('descripcion').value = descripcion;
            document.getElementById('cantidad_produccion').value = cantidad_produccion;
            document.getElementById('id_galleta').value = id_galleta;

            // Enviar el formulario oculto
            document.getElementById('hiddenForm').submit();
        }
    });
});

function editReceta(id) {
    var row = document.querySelector('#tblReceta tbody tr[data-id="' + id + '"]');

    var nombre_receta = row.children[0].textContent;
    var descripcion = row.children[1].textContent;
    var cantidad_produccion = row.children[3].textContent;
    var id_galleta = row.children[2].getAttribute('data-id');
    var nombre_galleta = row.children[2].textContent;

    var selectHTML = '';
    galletas.forEach(galleta => {
        if (galleta.id == id_galleta) {
            selectHTML += '<option value="' + galleta.id + '" selected>' + galleta.nombre_galleta + '</option>';
        } else {
            selectHTML += '<option value="' + galleta.id + '">' + galleta.nombre_galleta + '</option>';
        }
    });

    Swal.fire({
        title: 'Editar Receta',
        html: `
            <input class="form-control mb-3" id="swalnombre" placeholder="Nombre" value="${nombre_receta}">
            <input class="form-control mb-3" id="swaldescripcion" placeholder="Descripcion" value="${descripcion}">
            <input class="form-control mb-3" id="swalcantidad" placeholder="Cantidad" value="${cantidad_produccion}">
            <select class="form-control mb-3" id="swalidgalleta">
                <option value="${id_galleta}" selected>${nombre_galleta}</option>
                ${selectHTML}
            </select>`,
        confirmButtonText: 'Actualizar',
        focusConfirm: false,
        preConfirm: () => {
            const nombre_receta = document.getElementById('swalnombre').value;
            const descripcion = document.getElementById('swaldescripcion').value;
            const cantidad_produccion = document.getElementById('swalcantidad').value;
            const id_galleta = document.getElementById('swalidgalleta').value;

            if (!nombre_receta || !descripcion || !cantidad_produccion || !id_galleta) {
                Swal.showValidationMessage('Por favor, rellene todos los campos');
                return false;
            }

            return { id, nombre_receta, descripcion, cantidad_produccion, id_galleta };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { id, nombre_receta, descripcion, cantidad_produccion, id_galleta } = result.value;

            document.getElementById('hiddenId').value = id;
            document.getElementById('nombre_receta').value = nombre_receta;
            document.getElementById('descripcion').value = descripcion;
            document.getElementById('id_galleta').value = id_galleta; 
            document.getElementById('cantidad_produccion').value = cantidad_produccion;

            document.getElementById('hiddenForm').submit();
        }
    });
}

document.querySelectorAll('.confirm-submit').forEach((button) => {
    button.addEventListener('click', function(event) {
        event.preventDefault();

        var form = this.closest('form');
        var action = form.action.endsWith('activate') ? 'activar' : 'eliminar';

        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres ${action} esta receta?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, quiero hacerlo',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                form.submit();
            }
        });
    });
});



var ingredientesAgregados = new Set();

// Función para agregar un detalle a la tabla y al conjunto de ingredientes
function addDetalleToTable(id_receta, id_materia_prima, cantidad) {
    // Verificar si el ingrediente ya ha sido agregado
    if (ingredientesAgregados.has(id_materia_prima)) {
        Swal.fire({
            icon: 'warning',
            title: 'Ingrediente ya agregado',
            text: 'Este ingrediente ya ha sido agregado a la receta.',
        });
        return;
    }

    // Si no ha sido agregado, agregarlo a la tabla y al conjunto
    ingredientesAgregados.add(id_materia_prima);

    var materia_prima = materias.find(materia => materia.id == id_materia_prima);

    var table = $('#tblDetallesReceta');
    var newRow = table.DataTable().row.add([
        materia_prima.nombre,
        cantidad,
        id_receta, 
        `<button class="btn btn-danger btn-sm" onclick="removeDetalle(this)">Eliminar</button>`
    ]).draw().node();

    $(newRow).append('<input type="hidden" name="id_receta" value="' + id_receta + '">');
    $(newRow).attr('data-id-materia-prima', id_materia_prima);
}

// Función para agregar ingredientes en bucle
function addIngredientesEnBucle(id_receta) {
    var ingredientes = [];



    function agregarIngrediente() {
        var selectHTML = '';
        var unidad_m = '';
        materias.forEach(materia => {
            selectHTML += '<option value="' + materia.id + '">' + materia.nombre + '</option>';
            unidad_m += '<option value="' + materia.id + '">' + materia.unidad_medida + '</option>';
        });

        Swal.fire({
            title: 'Agregar Ingrediente',
            html: `
                <select class="form-control mb-3" id="swalidmateria">
                    ${selectHTML}
                </select>
                <input type="number" min="1" class="form-control mb-3" id="swalcantidad" placeholder="Cantidad">
                <select class="form-control mb-3" id="swalidmateria">
                ${unidad_m}
            </select>`,
            confirmButtonText: 'Agregar',
            showCancelButton: true,
            cancelButtonText: 'Finalizar Receta',
            focusConfirm: false,
            preConfirm: () => {
                const id_materia_prima = document.getElementById('swalidmateria').value;
                const cantidad = document.getElementById('swalcantidad').value;

                if (!id_materia_prima || !cantidad ) {
                    Swal.showValidationMessage('Por favor, rellene todos los campos');
                    return false;
                }

                ingredientes.push({ id_materia_prima, cantidad });

                addDetalleToTable(id_receta, id_materia_prima, cantidad);

                document.getElementById('swalidmateria').value = '';
                document.getElementById('swalcantidad').value = '';
            }
        }).then((result) => {
            if (!result.dismiss) {
                agregarIngrediente();
            } else {
                finishDetalles(ingredientes);
            }
        });
    }

    agregarIngrediente();
}

function finishDetalles(ingredientes) {
    if (ingredientes.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debes agregar al menos un ingrediente antes de finalizar los detalles'
        });
        return;
    }

    var detallesString = ingredientes.map(detalle => {
        var materia_prima = materias.find(materia => materia.id == detalle.id_materia_prima);
        return `${materia_prima.nombre}: ${detalle.cantidad} `;
    }).join('\n');

    Swal.fire({
        title: 'Detalles de la Receta',
        text: detallesString,
        icon: 'info',
        confirmButtonText: 'OK'
    });
}

function removeDetalle(button) {
    var row = $(button).closest('tr');
    var id_materia_prima = row.data('id-materia-prima');

    // Remover el ingrediente del conjunto de ingredientes agregados
    ingredientesAgregados.delete(id_materia_prima);

    row.remove();
}

document.getElementById('finalizar').addEventListener('click', function() {
    var detalles_receta = obtenerDetallesReceta();
    document.getElementById('detalles_receta').value = JSON.stringify(detalles_receta);
    document.getElementById('formDetallesReceta').submit();
});

function obtenerDetallesReceta() {
    var detalles_receta = [];
    $('#tblDetallesReceta tbody tr').each(function() {
        var id_receta =  $(this).find('td:eq(2)').text();
        var id_materia_prima = $(this).data('id-materia-prima');
        var cantidad = $(this).find('td:eq(1)').text();
        detalles_receta.push({
            id_receta:id_receta,
            id_materia_prima: id_materia_prima,
            cantidad: cantidad
        });
    });
    return detalles_receta;
}

console.log("Detalles JSON:", detalles_json);

document.querySelectorAll('.ver-detalles').forEach((button) => {
    button.addEventListener('click', function() {
        var idReceta = this.dataset.idReceta; // Obtener el ID de la receta del atributo data-id-receta
        
        var detallesReceta = detalles_json.filter(detalle => detalle.id_receta == idReceta); 

        if (detallesReceta.length > 0) {

            var mensaje = 'Ingredientes:'+'<br><br>';
            detallesReceta.forEach(detalle => {
                mensaje += 'Nombre: ' + detalle.nombre + '<br>' +
                           'Cantidad: ' + detalle.cantidad +  '<br>' +
                           'Unidad de medida: ' + detalle.unidad_medida + '<br><br>';
            });


            // Mostrar el pop-up de SweetAlert con los detalles de la receta
            Swal.fire({
                title: 'Detalles de la receta',
                html: mensaje,
                icon: 'info',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'No se encontraron detalles',
                text: 'No hay detalles disponibles para esta receta.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    });
});


function tablaDetallesRecetaTieneFilas() {
    return $('#tblDetallesReceta tbody tr').length > 0;
}

function habilitarBotonFinalizar() {
    var finalizarBtn = document.getElementById('finalizar');
    finalizarBtn.disabled = !tablaDetallesRecetaTieneFilas();
}

habilitarBotonFinalizar();

$('#tblDetallesReceta').on('draw.dt', function() {
    habilitarBotonFinalizar();
});

$('#finalizar').on('click', function() {
});
