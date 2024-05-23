
var table = $('#tblStock').DataTable({
    lengthChange: true, // permite a los usuarios cambiar el número de registros por página
    pageLength: 10, // establece el número inicial de registros por página
    responsive: true, // habilita la funcionalidad responsive
    columnDefs: [
      { responsivePriority: 1, targets: 0, className: 'all' }, // siempre visible
      { responsivePriority: 2, targets: 1, className: 'all' }, // visible solo en desktop
      { responsivePriority: 3, targets: 2, className: 'desktop' }, // oculto por defecto
      { responsivePriority: 4, targets: 3, className: 'desktop' }, // visible solo en desktop
      { responsivePriority: 5, targets: 4, className: 'all' }, // oculto por defecto
      { responsivePriority: 6, targets: 5, className: 'all' }, // visible solo en desktop
      // Agrega más definiciones de columnas según sea necesario
    ]
  });

  var table = $('#tbl_Totalstock').DataTable({
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