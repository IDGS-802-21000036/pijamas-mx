// Inicializa la tabla con DataTables
var table = $('#tblProduction').DataTable({
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

document.getElementById('addProduction').addEventListener('click', function() {
    var selectElement = document.getElementById('select_recetas').outerHTML;
    selectHTML = selectElement.replace('select_recetas', 'swalreceta');
    Swal.fire({
      title: 'Nueva Produccion',
      html: `
        ${selectHTML}
      `,
      confirmButtonText: 'Guardar',
      focusConfirm: false,
      preConfirm: () => {
        const id = 0;
        const receta = document.getElementById('swalreceta').value;
  
        if (!receta) {
          Swal.showValidationMessage('Por favor, seleccione una receta');
          return false;
        }
  
        // Llenar el formulario oculto con los datos recogidos
        document.getElementById('id_produccion').value = '0';
        document.getElementById('id_receta').value = receta;
        document.getElementById('hiddenForm').submit();
      }
    });
  });

  function modificar_estatus(id_produccion, status){
    var mensaje = "";
    if  (status == 0){
      var mensaje = "Enviar a produccion";
    }
    if  (status == 1){
      var mensaje = "Enviar a horno";
    }
    if  (status == 2){
        var mensaje = "Empaquetar";
    }
    if  (status == 3){
        var mensaje = "Entregar";
    }
    Swal.fire({
      title: 'Modificar status',
      html: `
        <p>¿Está seguro que desea ${mensaje}?</p>
    `,
      confirmButtonText: 'Modificar',
      focusConfirm: false,
      preConfirm: () => {
  
        // Llenar el formulario oculto con los datos recogidos
        document.getElementById('id_modificar_produccion').value = id_produccion;
        document.getElementById('status_modificar').value = status;
        document.getElementById('hiddenFormModificar').submit();
      }
    });
  }

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
        confirmButtonText: 'Aceptar',
        focusConfirm: false,
        width: '80%',
        preConfirm: () => {
        }
    });
});