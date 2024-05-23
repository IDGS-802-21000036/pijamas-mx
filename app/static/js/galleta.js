// Inicializa la tabla con DataTables
var table = $('#tblCookie').DataTable({
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
  
  document.getElementById('addCookie').addEventListener('click', function() {
      Swal.fire({
        title: 'Nueva Galleta',
        html: `
          <input class="form-control mb-3" id="swalnombre" placeholder="Nombre">
          <input class="form-control mb-3" id="swalpreciounitario" placeholder="Precio Unitario">
          <input class="form-control mb-3" id="swalpreciokilo" placeholder="Precio por Kilo">
          <input class="form-control mb-3" id="swaldescripcion" placeholder="Descripción">
          <input class="form-control mb-3" id="swalpesogalleta" placeholder="Peso Galleta">
        `,
        confirmButtonText: 'Guardar',
        focusConfirm: false,
        preConfirm: () => {
          const id = 0;
          const nombre_galleta = document.getElementById('swalnombre').value;
          const precio_unitario = document.getElementById('swalpreciounitario').value;
          const precio_kilo = document.getElementById('swalpreciokilo').value;
          const descripcion = document.getElementById('swaldescripcion').value;
          const peso_galleta = document.getElementById('swalpesogalleta').value;
    
          if (!nombre_galleta || !precio_unitario || !precio_kilo || !descripcion || !peso_galleta) {
            Swal.showValidationMessage('Por favor, rellene todos los campos');
            return false;
          }
    
          // Llenar el formulario oculto con los datos recogidos
          document.getElementById('hiddenId').value = id;
          document.getElementById('nombre_galleta').value = nombre_galleta;
          document.getElementById('precio_unitario').value = precio_unitario;
          document.getElementById('precio_kilo').value = precio_kilo;
          document.getElementById('descripcion').value = descripcion;
          document.getElementById('peso_galleta').value = peso_galleta;
    
          // Enviar el formulario oculto
          document.getElementById('hiddenForm').submit();
        }
      });
    });
  
    function editCookie(id) {
      // Encuentra la fila que tiene el ID correspondiente
      var row = document.querySelector('#tblCookie tbody tr[data-id="' + id + '"]');
    
      // Obtiene los datos de la fila
      var nombre_galleta = row.children[0].textContent;
      var precio_unitario = row.children[1].textContent;
      var precio_kilo = row.children[2].textContent;
      var descripcion = row.children[3].textContent;
      var peso_galleta = row.children[4].textContent;
    
      Swal.fire({
        title: 'Editar Galleta',
        html: `
          <input class="form-control mb-3" id="swalnombre" placeholder="Nombre" value="${nombre_galleta}">
          <input class="form-control mb-3" id="swalpreciounitario" placeholder="Precio Unitario" value="${precio_unitario}">
          <input class="form-control mb-3" id="swalpreciokilo" placeholder="Precio por Kilo" value="${precio_kilo}">
          <input class="form-control mb-3" id="swaldescripcion" placeholder="Descripción" value="${descripcion}">
          <input class="form-control mb-3" id="swalpesogalleta" placeholder="Peso Galleta" value="${peso_galleta}">
        `,
        confirmButtonText: 'Actualizar',
        focusConfirm: false,
        preConfirm: () => {
          const nombre_galleta = document.getElementById('swalnombre').value;
          const precio_unitario = document.getElementById('swalpreciounitario').value;
          const precio_kilo = document.getElementById('swalpreciokilo').value;
          const descripcion = document.getElementById('swaldescripcion').value;
          const peso_galleta = document.getElementById('swalpesogalleta').value;
    
          if (!nombre_galleta || !precio_unitario || !precio_kilo || !descripcion || !peso_galleta) {
            Swal.showValidationMessage('Por favor, rellene todos los campos');
            return false;
          }
    
          return { id, nombre_galleta, precio_unitario, precio_kilo, descripcion, peso_galleta };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const { id, nombre_galleta, precio_unitario, precio_kilo, descripcion, peso_galleta } = result.value;
    
          // Llenar el formulario oculto con los datos recogidos
          document.getElementById('hiddenId').value = id;
          document.getElementById('nombre_galleta').value = nombre_galleta;
          document.getElementById('precio_unitario').value = precio_unitario;
          document.getElementById('precio_kilo').value = precio_kilo;
          document.getElementById('descripcion').value = descripcion;
          document.getElementById('peso_galleta').value = peso_galleta;
    
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
          text: `¿Quieres ${action} esta galleta?`,
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
