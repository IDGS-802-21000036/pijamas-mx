$('#tblSupply').DataTable({
    lengthChange: true, // permite a los usuarios cambiar el número de registros por página
    pageLength: 10, // establece el número inicial de registros por página
    responsive: true, // habilita la funcionalidad responsive
    columnDefs: [
        { responsivePriority: 1, targets: 0, className: 'all' }, // siempre visible
        { responsivePriority: 2, targets: 1, className: 'dekstop' }, // visible solo en desktop
        { responsivePriority: 3, targets: 2, className: 'all' }, // oculto por defecto
        // Agrega más definiciones de columnas según sea necesario
    ]
}
);

document.getElementById('addSupplyButton').addEventListener('click', function () {
    Swal.fire({
        title: 'Nuevo insumo',
        html: `
          <input type="text" class="form-control mb-3" id="swalnombre" placeholder="Nombre">
          <textarea rows="4" cols="50" class="form-control mb-3" id="swaldescripcion" placeholder="Descripcion"></textarea>
          <input type="number" class="form-control mb-3" id="swalmin_stock" min="1" max="999" placeholder="Cantidad minima permitida en almacen">
            <input type="number" class="form-control mb-3" id="swalmax_stock" min="1" max="999" placeholder="Cantidad maxima permitida en almacen">
          <select name="unidad_medida" class="form-control mb-3">
            <option value="" disabled selected>Unidad de medida</option>
            <option value="pz">Pieza (pz)</option>
            <option value="L">Litro (L)</option>
            <option value="kg">Kilogramo (kg)</option>
          </select>
        `,
        confirmButtonText: 'Guardar',
        focusConfirm: false,
        preConfirm: () => {
            const id = 0;
            const nombre = document.getElementById('swalnombre');
            const descripcion = document.getElementById('swaldescripcion');
            const min_stock = document.getElementById('swalmin_stock');
            const max_stock = document.getElementById('swalmax_stock');
            const unidad_medida = document.querySelector('select[name="unidad_medida"]');
            
            console.log(nombre.value, descripcion.value, unidad_medida.value);
            if (!nombre.value || !descripcion.value || !min_stock.value || !min_stock.value || !max_stock.value || !unidad_medida.value){
                Swal.showValidationMessage('Todos los campos son requeridos');
                if (!nombre.value) nombre.classList.add('is-invalid');
                if (!descripcion.value) descripcion.classList.add('is-invalid');
                if (!min_stock.value) min_stock.classList.add('is-invalid');
                if (!max_stock.value) max_stock.classList.add('is-invalid');
                if (!unidad_medida.value) unidad_medida.classList.add('is-invalid');
                removeInvalidClassAfterDelay();
                return false;
            }

            if (isNaN(min_stock.value) || parseFloat(min_stock.value) < 1) {
                Swal.showValidationMessage('La cantidad en almacen debe ser un número positivo');
                min_stock.classList.add('is-invalid');
                removeInvalidClassAfterDelay();
                return false;
            }

            if (isNaN(min_stock.value) || parseFloat(min_stock.value) < 1) {
                Swal.showValidationMessage('La cantidad minima permitida en almacen debe ser un número positivo');
                min_stock.classList.add('is-invalid');
                removeInvalidClassAfterDelay();
                return false;
            }

            if (isNaN(max_stock.value) || parseFloat(max_stock.value) < 1) {
                Swal.showValidationMessage('La cantidad maxima permitida en almacen debe ser un número positivo');
                max_stock.classList.add('is-invalid');
                removeInvalidClassAfterDelay();
                return false;
            }

            if (parseFloat(min_stock.value) > parseFloat(max_stock.value)) {
                Swal.showValidationMessage('La cantidad minima permitida en almacen no puede ser mayor a la cantidad maxima permitida en almacen');
                min_stock.classList.add('is-invalid');
                max_stock.classList.add('is-invalid');
                removeInvalidClassAfterDelay();
                return false;
            }


            if (unidad_medida.value === ''){
                Swal.showValidationMessage('La unidad de medida es requerida');
                unidad_medida.classList.add('is-invalid');
                removeInvalidClassAfterDelay();
                return false;
            }

            if (unidad_medida.value === 'pz'){
                if (min_stock.value % 1 !== 0) {
                    Swal.showValidationMessage('La cantidad minima permitida en almacen debe ser un número entero');
                    min_stock.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (max_stock.value % 1 !== 0) {
                    Swal.showValidationMessage('La cantidad maxima permitida en almacen debe ser un número entero');
                    max_stock.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
            }

            console.log(id, nombre.value, descripcion.value, min_stock.value, unidad_medida.value);
            return { id: id, nombre: nombre.value, descripcion: descripcion.value, min_stock: min_stock.value, max_stock: max_stock.value, unidad_medida: unidad_medida.value };
        }
      }).then((result) => {
        if (result.isConfirmed) {
            const { id, nombre, descripcion, min_stock, max_stock, unidad_medida } = result.value;
          console.log(id, nombre, descripcion, unidad_medida);
    
          // Llenar el formulario oculto con los datos recogidos
          document.getElementById('hiddenId').value = id;
          document.getElementById('nombre').value = nombre;
            document.getElementById('descripcion').value = descripcion;
            min_stock % 1 === 0 ? document.getElementById('min_stock').value = parseInt(min_stock) : document.getElementById('min_stock').value = parseFloat(min_stock);
            max_stock % 1 === 0 ? document.getElementById('max_stock').value = parseInt(max_stock) : document.getElementById('max_stock').value = parseFloat(max_stock);
            document.getElementById('unidad_medida').value = unidad_medida;
    
          // Enviar el formulario oculto
          document.getElementById('hiddenForm').submit();
        }
      });
});

function removeInvalidClassAfterDelay() {
    setTimeout(function() {
        document.querySelectorAll('.is-invalid').forEach(function(element) {
            element.classList.remove('is-invalid');
        });
    }, 5000);
}

