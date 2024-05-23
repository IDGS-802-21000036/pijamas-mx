// Inicializa la tabla con DataTables
var table = $('#tblSolicitudes').DataTable({
    lengthChange: true, // permite a los usuarios cambiar el número de registros por página
    pageLength: 10, // establece el número inicial de registros por página
    responsive: true, // habilita la funcionalidad responsive
    columnDefs: [
        { responsivePriority: 1, targets: 0, className: 'all' }, // siempre visible
        { responsivePriority: 2, targets: 1, className: 'all' }, // visible solo en desktop
        { responsivePriority: 3, targets: 2, className: 'desktop' }, // oculto por defecto
        { responsivePriority: 4, targets: 3, className: 'desktop' }, // visible solo en desktop
        { responsivePriority: 5, targets: 4, className: 'all' }, // oculto por defecto
        // Agrega más definiciones de columnas según sea necesario
    ]
});
var tableVent = $('#tblVentas').DataTable({
    lengthChange: true, // permite a los usuarios cambiar el número de registros por página
    pageLength: 10, // establece el número inicial de registros por página
    responsive: true, // habilita la funcionalidad responsive
    columnDefs: [
        { responsivePriority: 1, targets: 0, className: 'all' }, // siempre visible
        { responsivePriority: 2, targets: 1, className: 'all' }, // visible solo en desktop
        { responsivePriority: 3, targets: 2, className: 'desktop' }
    ]
});
var tableProd = $('#tblProduction').DataTable({
    lengthChange: true, // permite a los usuarios cambiar el número de registros por página
    pageLength: 10, // establece el número inicial de registros por página
    responsive: true, // habilita la funcionalidad responsive
    columnDefs: [
        { responsivePriority: 1, targets: 0, className: 'all' }, // siempre visible
        { responsivePriority: 2, targets: 1, className: 'all' }, // visible solo en desktop
        { responsivePriority: 3, targets: 2, className: 'desktop' }, // oculto por defecto
        { responsivePriority: 4, targets: 3, className: 'desktop' }, // visible solo en desktop
        // Agrega más definiciones de columnas según sea necesario
    ]
});
document.getElementById('verProducciones').addEventListener('click', function () {
    var $tableProd = $('#tblProduction');

    var tableHtmlProd = $tableProd.DataTable().table().container().innerHTML;

    Swal.fire({
        width: '80%',
        title: 'Lista de Producción',
        html: `
          <div id="produccionesPopup">${tableHtmlProd}</div>
        `,
        confirmButtonText: 'Cerrar',
        focusConfirm: false,
        customClass: 'swal-wide',
        preConfirm: () => {
        }
    });
});
document.getElementById('verVentas').addEventListener('click', function () {
    var $tableVentas = $('#tblVentas');

    var tableHtmlVent = $tableVentas.DataTable().table().container().innerHTML;

    Swal.fire({
        width: '80%',
        title: 'Lista de Ventas',
        html: `
          <div id="produccionesPopup">${tableHtmlVent}</div>
        `,
        confirmButtonText: 'Cerrar',
        focusConfirm: false,
        customClass: 'swal-wide',
        preConfirm: () => {
        }
    });
});
document.getElementById('confirmar_venta').addEventListener('click', function () {
    Swal.fire({
        title: 'Confirmar Venta',
        html: `
            <p>¿Está seguro que desea confirmar la venta?</p>
        `,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        showCancelButton: true, // Esto mostrará el botón de cancelar
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#dc3545',
        preConfirm: () => {

            Swal.fire({
                title: 'Venta Confirmada',
                html: `
                    <p>¿Quieres imprimir el ticket?</p>
                `,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Imprimir',
                focusConfirm: false,
                showCancelButton: true,
                preConfirm: (choice) => {
                    if (choice === 'cancel') {
                        document.getElementById('venta_form').submit();
                        console.log('Impreso');
                    } else {
                        document.getElementById('venta_form').submit();
                    }
                }
            });
        }
    });       
});


document.getElementById('verSolicitudes').addEventListener('click', function () {
    var $table = $('#tblSolicitudes'); // Reemplaza 'tableId' con el ID de tu tabla
    var $clonedTable = $table.clone().attr('id', 'tblSolicitudesPopup').DataTable(
        {
            lengthChange: false,
            pageLength: 5,
            responsive: true,
            columnDefs: [
                { responsivePriority: 1, targets: 0, className: 'all' },
                { responsivePriority: 2, targets: 1, className: 'all' },
                { responsivePriority: 3, targets: 2, className: 'desktop' },
                { responsivePriority: 4, targets: 3, className: 'desktop' },
                { responsivePriority: 5, targets: 4, className: 'all' }
            ]
        }
    );
    var tableHtml = $clonedTable.table().container().innerHTML;

    Swal.fire({
        title: 'Solicitudes de Produccion',
        html: `
          <div id="solicitudesPopup">${tableHtml}</div>
        `,
        confirmButtonText: 'Solicitar Produccion',
        focusConfirm: false,
        width: '80%',
        preConfirm: () => {
            var selectElement = document.getElementById('select_recetas').outerHTML;
            selectHTML = selectElement.replace('select_recetas', 'swalreceta');
            Swal.fire({

                title: 'Solicitar Produccion',
                html: `
                <p>Seleccione una receta para solicitar la produccion</p> 
                ${selectHTML}
                `,
                confirmButtonText: 'Confirmar',
                focusConfirm: false,
                preConfirm: () => {
                    const receta = document.getElementById('swalreceta').value;
                    if (!receta) {
                        Swal.showValidationMessage('Por favor, seleccione una receta');
                        return false;
                    }

                    document.getElementById('id_solicitud').value = 0;
                    document.getElementById('id_usuario').value = 1;
                    document.getElementById('id_receta').value = receta;

                    document.getElementById('solicitudForm').submit();
                }
            });
        }
    });
});

