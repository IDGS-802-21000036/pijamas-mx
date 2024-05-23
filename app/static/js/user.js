// Inicializa la tabla con DataTables
var table = $('#tblUser').DataTable({
    lengthChange: true, // permite a los usuarios cambiar el número de registros por página
    pageLength: 10, // establece el número inicial de registros por página
    responsive: true, // habilita la funcionalidad responsive
    columnDefs: [
      { responsivePriority: 1, targets: 0, className: 'all' }, // siempre visible
      { responsivePriority: 2, targets: 1, className: 'all' }, // visible solo en desktop
      { responsivePriority: 3, targets: 2, className: 'desktop' }, // oculto por defecto
      { responsivePriority: 4, targets: 3, className: 'desktop' }, // visible solo en desktop
      { responsivePriority: 5, targets: 4, className: 'all' } // oculto por defecto
      // Agrega más definiciones de columnas según sea necesario
    ]
  });
  
  document.getElementById('addUser').addEventListener('click', function() {
      var selectElement = document.getElementById('select_rol').outerHTML;
      selectHTML = selectElement.replace('select_rol', 'swalrol');
      Swal.fire({
        title: 'Nuevo Usuario',
        html: `
          <input class="form-control mb-3" id="swalusuario" placeholder="Usuario">
          <input class="form-control mb-3" id="swalcorreo" placeholder="Correo">
          <input class="form-control mb-3" id="swalcontrasenia" placeholder="Contrasena">
          ${selectHTML}
        `,
        confirmButtonText: 'Guardar',
        focusConfirm: false,
        preConfirm: () => {
          const id = 0;
          const usuario = document.getElementById('swalusuario').value;
          const correo = document.getElementById('swalcorreo').value;
          const contrasenia = document.getElementById('swalcontrasenia').value;
          const rol = document.getElementById('swalrol').value;
    
          if (!usuario || !correo || !contrasenia || !rol) {
            Swal.showValidationMessage('Por favor, rellene todos los campos');
            return false;
          }

          /* var regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$');
          if (!regex.test(contrasenia)) {
            Swal.showValidationMessage('La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.');
            return false;
          } */
    
          // Llenar el formulario oculto con los datos recogidos
          document.getElementById('hiddenId').value = id;
          document.getElementById('usuario').value = usuario;
          document.getElementById('correo').value = correo;
          document.getElementById('contrasenia').value = contrasenia;
          document.getElementById('rol_id').value = rol;
    
          // Enviar el formulario oculto
          document.getElementById('hiddenForm').submit();
        }
      });
    });
  
    function editUser(id) {
      var selectElement = document.getElementById('select_rol').outerHTML;
      selectHTML = selectElement.replace('select_rol', 'edit_rol');
      // Encuentra la fila que tiene el ID correspondiente
      var row = document.querySelector('#tblUser tbody tr[data-id="' + id + '"]');
    
      // Obtiene los datos de la fila
      var id = id;
      var usuario = row.children[0].textContent;
      var correo = row.children[1].textContent;
      var rol = row.children[2].textContent;

  
    
      Swal.fire({
        title: 'Editar Usuario',
        html: `
        <input class="form-control mb-3" id="edit_id" style="display:none;" value="${id}">
          <input class="form-control mb-3" id="edit_usuario" placeholder="Usuario" value="${usuario}">
          <input class="form-control mb-3" id="edit_correo" placeholder="Correo" value="${correo}">
          <input class="form-control mb-3" id="edit_contrasenia" placeholder="Contrasena" value="">
          ${selectHTML}
        `,
        confirmButtonText: 'Actualizar',
        focusConfirm: false,
        preConfirm: () => {
          const id = document.getElementById('edit_id').value;
          const usuario = document.getElementById('edit_usuario').value;
          const correo = document.getElementById('edit_correo').value;
          const contrasenia = document.getElementById('edit_contrasenia').value;
          const rol = document.getElementById('edit_rol').value;
    
          if (!usuario || !correo || !contrasenia || !rol) {
            Swal.showValidationMessage('Por favor, rellene todos los campos');
            return false;
          }

        }
      }).then((result) => {
        if (result.isConfirmed) {
    
          // Llenar el formulario oculto con los datos recogidos
          document.getElementById('hiddenId').value = id;
          document.getElementById('usuario').value = usuario;
          document.getElementById('correo').value = correo;
          document.getElementById('contrasenia').value = contrasenia;
          document.getElementById('rol_id').value = rol;
    
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
          text: `¿Quieres ${action} este usuario?`,
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
