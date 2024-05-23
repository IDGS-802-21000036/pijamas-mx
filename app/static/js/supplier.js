// Inicializa la tabla con DataTables
var table = $('#tblSupplier').DataTable({
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
}
);

// Inicializa la tabla con DataTables
var tableSupply = $('#tblSupply').DataTable({
  lengthChange: true, // permite a los usuarios cambiar el número de registros por página
  pageLength: 10, // establece el número inicial de registros por página
  responsive: true, // habilita la funcionalidad responsive
  columnDefs: [
      { responsivePriority: 1, targets: 0, className: 'all' }, // siempre visible
      { responsivePriority: 2, targets: 1, className: 'dekstop' }, // visible solo en desktop
      { responsivePriority: 3, targets: 2, className: 'all' }, // oculto por defecto
      { responsivePriority: 4, targets: 3, className: 'all' }, // visible solo en desktop
      { responsivePriority: 5, targets: 4, className: 'all' }, // oculto por defecto
      // Agrega más definiciones de columnas según sea necesario
  ]
}
);

document.getElementById('addSupplierButton').addEventListener('click', function() {
    Swal.fire({
      title: 'Nuevo Proveedor',
      html: `
        <input class="form-control mb-3" id="swalnombre" placeholder="Nombre">
        <input class="form-control mb-3" id="swalrfc" placeholder="RFC">
        <input class="form-control mb-3" id="swalcorreo" placeholder="Correo">
        <input class="form-control mb-3" maxlength="10" id="swaltelefono" placeholder="Teléfono">
      `,
      confirmButtonText: 'Guardar',
      focusConfirm: false,
      preConfirm: () => {
        const id = 0;
        const nombre = document.getElementById('swalnombre').value;
        const rfc = document.getElementById('swalrfc').value;
        const correo = document.getElementById('swalcorreo').value;
        const telefono = document.getElementById('swaltelefono').value;
  
        if (!nombre || !rfc || !correo || !telefono) {
          Swal.showValidationMessage('Por favor, rellene todos los campos');
          return false;
        }
  
        return {id, nombre, rfc, correo, telefono };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const {id, nombre, rfc, correo, telefono } = result.value;
  
        // Llenar el formulario oculto con los datos recogidos
        document.getElementById('hiddenId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('rfc').value = rfc;
        document.getElementById('correo').value = correo;
        document.getElementById('telefono').value = telefono;
  
        // Enviar el formulario oculto
        document.getElementById('hiddenForm').submit();
      }
    });
  });

  function editSupplier(id) {
    // Encuentra la fila que tiene el ID correspondiente
    var row = document.querySelector('#tblSupplier tbody tr[data-id="' + id + '"]');
  
    // Obtiene los datos de la fila
    var nombre = row.children[0].textContent;
    var rfc = row.children[1].textContent;
    var correo = row.children[2].textContent;
    var telefono = row.children[3].textContent;
  
    Swal.fire({
      title: 'Editar Proveedor',
      html: `
        <input class="form-control mb-3" id="swalnombre" placeholder="Nombre" value="${nombre}">
        <input class="form-control mb-3" id="swalrfc" placeholder="RFC" value="${rfc}">
        <input class="form-control mb-3" id="swalcorreo" placeholder="Correo" value="${correo}">
        <input class="form-control mb-3" maxlength="10" id="swaltelefono" placeholder="Teléfono" value="${telefono}">
      `,
      confirmButtonText: 'Actualizar',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = document.getElementById('swalnombre').value;
        const rfc = document.getElementById('swalrfc').value;
        const correo = document.getElementById('swalcorreo').value;
        const telefono = document.getElementById('swaltelefono').value;
  
        if (!nombre || !rfc || !correo || !telefono) {
          Swal.showValidationMessage('Por favor, rellene todos los campos');
          return false;
        }
  
        return { id, nombre, rfc, correo, telefono };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { id, nombre, rfc, correo, telefono } = result.value;
  
        // Llenar el formulario oculto con los datos recogidos
        document.getElementById('hiddenId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('rfc').value = rfc;
        document.getElementById('correo').value = correo;
        document.getElementById('telefono').value = telefono;
  
        // Enviar el formulario oculto
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
        text: `¿Quieres ${action} este proveedor?`,
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

  //Insumos
  const supplies = JSON.parse(document.getElementById('supplyData').dataset.supplies);
  var selectedSupplier = null;
  function editSupply(id) {
      console.log(supplies);
  
      // Obtiene los datos de los insumos
      const suppliesDataElement = document.getElementById('relationshipData');
      let tempSupplies = JSON.parse(suppliesDataElement.dataset.relationships);
      // Encuentra el insumo seleccionado
      selectedSupplier = tempSupplies.find(supplier => supplier.id === id);
      console.log(selectedSupplier);
  
  
      Swal.fire({
          width: '75%',
          title: 'Insumos',
          html: `
          <table id="tblSupply" class="table table-striped responsive nowrap" style="width:100%">
              <thead>
                  <tr>
                      <th>nombre</th>
                      <th>descripcion</th>
                      <th>stock</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody id='dataSupply'>
                  ${fillTable(supplies)}
              </tbody>
          </table>
          `,
          didOpen: () => {
              $('#tblSupply').DataTable({
                  lengthChange: true, // permite a los usuarios cambiar el número de registros por página
                  pageLength: 10, // establece el número inicial de registros por página
                  responsive: true, // habilita la funcionalidad responsive
                  columnDefs: [
                      { responsivePriority: 1, targets: 0, className: 'all' }, // siempre visible
                      { responsivePriority: 2, targets: 1, className: 'dekstop' }, // visible solo en desktop
                      { responsivePriority: 3, targets: 2, className: 'all' }, // oculto por defecto
                      { responsivePriority: 4, targets: 3, className: 'all' }, // visible solo en desktop
                      // Agrega más definiciones de columnas según sea necesario
                  ]
              });
          },
          confirmButtonText: 'Actualizar',
          focusConfirm: false,
          preConfirm: () => {
  
              return selectedSupplier;
          }
      }).then((result) => {
          if (result.isConfirmed) {
              const selectedSupply = result.value;
              console.log(selectedSupply)
              // Llenar el formulario oculto con los datos recogidos
              document.getElementById('supplier_id').value = selectedSupplier.id;
              document.getElementById('supplies_ids').value = selectedSupplier.supplies_list.map(value => value).join(',');
  
              // Enviar el formulario oculto
              document.getElementById('hiddenFormRelationship').submit();
          }
      });
  }
  
  function addSupply(supplyId) {
      console.log(supplyId)
      selectedSupplier.supplies_list.push(supplyId);
      console.log(selectedSupplier.supplies_list)
      changeButton(supplyId, true);
  }
  
  function removeSupply(supplyId) {
      selectedSupplier.supplies_list = selectedSupplier.supplies_list.filter(sup => sup !== supplyId);
      // Actualiza la tabla en el modal
      console.log("remover")
      console.log(selectedSupplier.suppliers_list)
      changeButton(supplyId, false);
  }
  
  function changeButton(idRow, flag){
      console.log('supply-'+idRow);
      let table = document.getElementById('dataSupply');
      let row = table.querySelector(`tr[data-id="supply-${idRow}"]`);
      let button = row.querySelector('button');
      let buttonText = flag ? 'Quitar' : 'Agregar';
      let buttonClass = flag ? 'btn-danger' : 'btn-primary';
      let actionButton = flag ? 'removeSupply' : 'addSupply';
      button.textContent = buttonText;
      button.className = 'btn '+buttonClass+' btn-sm';
      button.setAttribute('onclick', `${actionButton}(${idRow})`);
  
  }
  
  function fillTable(supplies){
  
      tableRows = supplies.map(supply => {
          let isSupplierInList = selectedSupplier.supplies_list.some(id => id === supply.id);
          let buttonClass = isSupplierInList ? 'btn-danger' : 'btn-primary';
          let buttonText = isSupplierInList ? 'Quitar' : 'Agregar';
          let buttonAction = isSupplierInList ? 'removeSupply' : 'addSupply';
  
          return `
          <tr data-id="supply-${supply.id}">
              <td>${supply.nombre}</td>
              <td>${supply.descripcion}</td>
              <td>${supply.stock} ${supply.unidad_medida}</td>
              <td><button class="btn ${buttonClass} btn-sm" onclick="${buttonAction}(${supply.id})">${buttonText}</button></td>
          </tr>`;
      });
      console.log(tableRows);
      return tableRows;
  }