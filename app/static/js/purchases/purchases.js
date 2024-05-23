var tablePurchaseHeader = $('#tblPurchasesHeader').DataTable({
    lengthChange: true, // permite a los usuarios cambiar el número de registros por página
    pageLength: 10, // establece el número inicial de registros por página
    responsive: true, // habilita la funcionalidad responsive
    columnDefs: [
        { responsivePriority: 1, targets: 0, className: 'all' }, // siempre visible
        { responsivePriority: 2, targets: 1, className: 'dekstop' }, // visible solo en desktop
        { responsivePriority: 3, targets: 2, className: 'all' }, // oculto por defecto
        { responsivePriority: 4, targets: 3, className: 'all' }, // siempre visible
        { responsivePriority: 5, targets: 4, className: 'dekstop' }, // visible solo en desktop

    ]
}
);

var tablePurchaseDetais = $('#tblPurchasesDetails').DataTable({
    lengthChange: true, // permite a los usuarios cambiar el número de registros por página
    pageLength: 10, // establece el número inicial de registros por página
    responsive: true, // habilita la funcionalidad responsive
    columnDefs: [
        { responsivePriority: 1, targets: 0, className: 'all' }, // siempre visible
        { responsivePriority: 2, targets: 1, className: 'all' }, // visible solo en desktop
        { responsivePriority: 3, targets: 2, className: 'all' }, // oculto por defecto
        { responsivePriority: 4, targets: 3, className: 'all' }, // siempre visible
        { responsivePriority: 5, targets: 4, className: 'dekstop' }, // visible solo en desktop
    ]
}
);

let selectedPurchase = []
let supplierSelected = null;
function addPurchase(purchaseId) {
    selectedPurchase.push(purchaseId);
    console.log(selectedPurchase);
}
let suppliesOfSupplier = [];
const suppliers = JSON.parse(document.getElementById('supplierData').getAttribute('data-suppliers'));
console.log(suppliers);
const supplies = JSON.parse(document.getElementById('supplyData').getAttribute('data-supplies'));
document.getElementById('addPurchaseButton').addEventListener('click', function () {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript comienzan en 0
    const year = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    let suppliesOfSupplier = [];
    Swal.fire({
        width: '85%',
        title: 'Nueva Compra',
        html: `
        <div class="card">
            <div class="card-header" id="headingOne">
            <h5 class="mb-0">
                <button class="btn dropdown-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#supplierCard" aria-expanded="true" aria-controls="supplierCard">
                Datos de la compra
                </button>
            </h5>
            </div>

            <div id="supplierCard" class="collapse show" aria-labelledby="headingOne">
            <div class="card-body">
                <select class="form-control mb-3" id="swalIdProveedor">
                    <option value="">Seleccione un proveedor</option>
                    ${suppliers.map(supplier => `<option value="${supplier.id}">${supplier.nombre}</option>`)}
                </select>
                <input type="datetime-local" class="form-control mb-3" id="swalFecha" placeholder="Fecha" max="${year}-${month}-${day}T${hours}:${minutes}">
                <input type="number" class="form-control mb-3" id="swalTotal" placeholder="Total" readonly>
            </div>
            </div>
        </div>
        <button id="addSupplyButton" class="btn btn-primary mt-3">Agregar Insumo</button>
        <table id="swalProductsTable" class="table table-striped responsive nowrap" style="width:100%;">
          <thead>
            <tr>
                <th>Insumo</th>
                <th>Contenido por unidad</th>
                <th>Unidad de medida</th>
                <th>Cantidad</th>
                <th>Precio del lote</th>
                <th>Fecha de caducidad</th>
                <th></th>
            </tr>
          </thead>
          <tbody id="dataDetailPurchase">
          </tbody>
        </table>
        
      `,
        confirmButtonText: 'Guardar',
        focusConfirm: false,
        allowOutsideClick: false, // Esto evitará que el SweetAlert se cierre cuando se haga clic fuera de él
        showConfirmButton: true, // Esto mostrará el botón de confirmar
        showCancelButton: true, // Esto mostrará el botón de cancelar
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#dc3545',
        didOpen: () => {
            $('#swalProductsTable').DataTable({
                searching: false, // deshabilita la barra de búsqueda
                paging: false, // deshabilita la paginación
                lengthChange: true, // permite a los usuarios cambiar el número de registros por página
                responsive: true, // habilita la funcionalidad responsive
                columnDefs: [
                    { responsivePriority: 1, targets: 0, className: 'all' }, // siempre visible
                    { responsivePriority: 2, targets: 1, className: 'all' }, // visible solo en desktop
                    { responsivePriority: 3, targets: 2, className: 'all' }, // oculto por defecto
                    { responsivePriority: 4, targets: 3, className: 'all' }, // visible solo en desktop
                    { responsivePriority: 5, targets: 4, className: 'all' }, // visible solo en desktop
                    { responsivePriority: 6, targets: 5, className: 'all' }, // visible solo en desktop
                    { responsivePriority: 7, targets: 6, className: 'all' }, // visible solo en desktop
                    // Agrega más definiciones de columnas según sea necesario
                ]
            });
            document.getElementById('swalFecha').onchange = function() {
                const selectedDateTime = new Date(this.value);
                const currentDateTime = new Date();
            
                // Convertir la fecha y hora actuales a la zona horaria de México
                const mexicoDateTime = new Date(currentDateTime.toLocaleString("en-US", {timeZone: "America/Mexico_City"}));
                console.log("mexicoDateTime", mexicoDateTime);
                console.log("selectedDateTime", selectedDateTime);
                if (selectedDateTime > mexicoDateTime) {
                    mexicoDateTime.setHours(mexicoDateTime.getHours() - 6);
                    this.value = mexicoDateTime.toISOString().slice(0,16);
                }
            };
            // Deshabilitar el botón addSupplyButton inicialmente
            const addSupplyButton = document.getElementById('addSupplyButton');
            addSupplyButton.disabled = true;

            // Habilitar el botón addSupplyButton cuando se elija un proveedor

            document.getElementById('swalIdProveedor').addEventListener('change', function () {
                if (document.getElementById('swalIdProveedor').value !== '') {
                    addSupplyButton.disabled = false;
                    supplierSelected = suppliers.find(supplier => supplier.id === parseInt(this.value));
                    suppliesOfSupplier = supplies.filter(supply => supplierSelected.supplies.includes(supply.id));
                    console.log(supplierSelected);
                    console.log(suppliesOfSupplier);
                    // Actualizar los valores del select
                    const selectElements = document.querySelectorAll('.supplies-supplier');
                    selectElements.forEach(select => {
                        select.innerHTML = suppliesOfSupplier.map(supply => `<option value="${supply.id}">${supply.nombre}</option>`).join('');
                    });
                }
                else {
                    addSupplyButton.disabled = this.value === '';
                }

            });
            document.getElementById('addSupplyButton').addEventListener('click', function () {
                const newRowData = [
                    `<select id="insumoSelect" class="form-control supplies-supplier">
                        <option selected disabled value = ''>Seleccione un insumo</option>
                        ${suppliesOfSupplier.map(supply => `<option value="${supply.id}">${supply.nombre}</option>`)}
                    </select>`,
                    '<input type="number" class="form-control" placeholder="Contenido por unidad">',
                    `<select class="unidadSelect form-control" name="unidad">
                        <option selected disabled selected value = ''>Seleccione un insumo</option>
                    </select>`,
                    '<input type="number" class="form-control" placeholder="Cantidad" min="1" max="100">',
                    '<input type="number" id="" class="form-control" placeholder="Precio del lote">',
                    '<input type="datetime-local" class="form-control" placeholder="Fecha">',
                    '<button class="btn btn-danger delete-row"><i class="fa-solid fa-trash"></i></button>'
                ];

                const table = $('#swalProductsTable').DataTable();
                const addedRow = table.row.add(newRowData).draw().node();
            
                // Agregar evento de clic al botón de eliminar
                $(addedRow).find('.delete-row').on('click', function() {
                    table.row($(this).parents('tr')).remove().draw();
                });

                const selectSupply = $(addedRow).find('.supplies-supplier');
                selectSupply.on('change', function() {
                    var unitsSelect = $(this).closest('tr').find('.unidadSelect');
                    const supplyId = $(this).val();

                        var selectedUnit = supplies.find(supply => supply.id === parseInt(supplyId)).unidad_medida;
                        console.log(selectedUnit);
                        if (selectedUnit){
                        // Obtén las unidades de suministro para la unidad seleccionada
                        var units = suppliesUnits(selectedUnit);
                    
                        // Vacía el select de la unidad
                        unitsSelect.empty();
                    
                        // Llena el select de la unidad con las unidades de suministro
                        $.each(units, function(index, unit) {
                            unitsSelect.append($('<option>', {
                                value: unit,
                                text: unit
                            }));
                        });
                    } else {
                        console.error('No se encontró el select de unidades de medida');
                    }
                });

                // Agregar evento de cambio a los campos de precio
                document.querySelectorAll('input[placeholder="Precio del lote"]').forEach(function(input) {
                    input.addEventListener('change', updateTotal);
                });

                // Llamar a la función para actualizar el total inicialmente
                updateTotal();

                // Actualizar el total
                const total = document.getElementById('swalTotal');
                const priceInputs = document.querySelectorAll('input[placeholder="Precio del lote"]');
                const quantityInputs = document.querySelectorAll('input[placeholder="Cantidad"]');
                let totalValue = 0;
                for (let i = 0; i < priceInputs.length; i++) {
                    const price = priceInputs[i].value;
                    const quantity = quantityInputs[i].value;
                    totalValue += price * quantity;
                }
                total.value = totalValue;
            });

        },
        preConfirm: () => {
            // Validar que se hayan ingresado todos los datos
            if (document.getElementById('swalIdProveedor').value === '') {
                Swal.showValidationMessage('Por favor, seleccione un proveedor');
                document.getElementById('swalIdProveedor').classList.add('is-invalid');
                // Eliminar el resaltado después de 5 segundos
                removeInvalidClassAfterDelay();
                return false;
            }
            if (document.getElementById('swalFecha').value === '') {
                Swal.showValidationMessage('Por favor, seleccione una fecha');
                document.getElementById('swalFecha').classList.add('is-invalid');
                // Eliminar el resaltado después de 5 segundos
                removeInvalidClassAfterDelay();

                return false;
            }
            let tableRows = document.getElementById('dataDetailPurchase').querySelectorAll('tr');
            if (tableRows.length === 0 || (tableRows.length === 1 && tableRows[0].innerText === 'No data available in table')) {
                Swal.showValidationMessage('Por favor, agregue al menos un insumo');
                return false;
            }

            document.getElementById('dataDetailPurchase').querySelectorAll('tr').forEach(row => {
                const supplyId = row.querySelector('.supplies-supplier');
                const price = row.querySelector('input[placeholder="Precio del lote"]');
                const contentUnity = row.querySelector('input[placeholder="Contenido por unidad"]');
                const unit = row.querySelector('select[name="unidad"]');
                const quantity = row.querySelector('input[placeholder="Cantidad"]');
                const date_expiration = row.querySelector('input[placeholder="Fecha"]');
                console.log(supplyId.value);
                console.log(price.value);
                console.log(contentUnity.value);
                console.log(unit.value);
                console.log(quantity.value);
                if (!supplyId.value || price.value === '' || contentUnity.value === '' || unit.value === '' || quantity.value === '', date_expiration.value === '') {
                    Swal.showValidationMessage('Por favor, rellene todos los campos');
                    // Resaltar los campos que faltan en rojo
                    if (!supplyId.value) supplyId.classList.add('is-invalid');
                    if (price.value === '') price.classList.add('is-invalid');
                    if (contentUnity.value === '') contentUnity.classList.add('is-invalid');
                    if (!unit.value) unit.classList.add('is-invalid');
                    if (quantity.value === '') quantity.classList.add('is-invalid');
                    if (date_expiration.value === '') date_expiration.classList.add('is-invalid');
                
                    // Eliminar el resaltado después de 5 segundos
                    removeInvalidClassAfterDelay();
                
                    return false;
                }
                
                // Validar que el precio, el contenido por unidad y la cantidad sean números positivos
                if (isNaN(price.value) || price.value <= 0) {
                    Swal.showValidationMessage('Por favor, introduzca un precio válido');
                    price.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (isNaN(contentUnity.value) || contentUnity.value <= 0) {
                    Swal.showValidationMessage('Por favor, introduzca un contenido por unidad válido');
                    contentUnity.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                console.log(unit.value, contentUnity.value, Number.isInteger(contentUnity.value));
                if(unit.value === 'un') {
                    let contentUnityValue = parseFloat(contentUnity.value);
                    if(!Number.isInteger(contentUnityValue)) {
                        Swal.showValidationMessage('Por favor, introduzca una cantidad entera');
                        contentUnity.classList.add('is-invalid');
                        removeInvalidClassAfterDelay();
                        return false;
                    }
                }

                if (isNaN(quantity.value) || quantity.value <= 0 || !Number.isInteger(parseFloat(quantity.value))) {
                        Swal.showValidationMessage('Por favor, introduzca una cantidad válida');
                        quantity.classList.add('is-invalid');
                        removeInvalidClassAfterDelay();
                        return false;
                }

                if (new Date(date_expiration.value) < new Date()) {
                    Swal.showValidationMessage('Por favor, introduzca una fecha de caducidad válida');
                    date_expiration.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
            }
            );

            const id_proveedor = document.getElementById('swalIdProveedor').value;
            const total = parseFloat(document.getElementById('swalTotal').value);
            const fecha = document.getElementById('swalFecha').value;
            const detalles = [];
            document.getElementById('dataDetailPurchase').querySelectorAll('tr').forEach(row => {
                const supplyId = parseInt(row.querySelector('.supplies-supplier').value);
                const price = parseFloat(row.querySelector('input[placeholder="Precio del lote"]').value);
                const contentUnity = parseFloat(row.querySelector('input[placeholder="Contenido por unidad"]').value);
                const unit = row.querySelector('select[name="unidad"]').value;
                const quantity = parseInt(row.querySelector('input[placeholder="Cantidad"]').value);
                const date_expiration = row.querySelector('input[placeholder="Fecha"]').value;
                detalles.push({ id_insumo: supplyId, precio_lote: price, contenido_por_unidad: contentUnity, unidad: unit, cantidad: quantity, fecha_caducidad: date_expiration });
            });

            return { id_proveedor, total, fecha, detalles };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { id_proveedor, total, fecha, detalles } = result.value;

            // Llenar el formulario oculto con los datos recogidos
            document.getElementById('hiddenProveedor_id').value = id_proveedor;
            document.getElementById('hiddenTotal').value = total;
            document.getElementById('hiddenFecha').value = fecha;
            document.getElementById('hiddenDetalles').value = JSON.stringify(detalles);

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

// Función para actualizar el total
function updateTotal() {
    const total = document.getElementById('swalTotal');
    const priceInputs = document.querySelectorAll('input[placeholder="Precio del lote"]');
    let totalValue = 0;
    for (let i = 0; i < priceInputs.length; i++) {
        const price = parseFloat(priceInputs[i].value);
        if (isNaN(price)) {
            console.log('El precio no es un número:', priceInputs[i].value);
            continue;
        }
        totalValue += price;
    }
    console.log(totalValue);
    total.value = totalValue;
}

function suppliesUnits(unit) {
    if (unit === 'pz') {
        return ['pz'];
    }
    if (unit === 'kg') {
        return ['kg', 'g', 'mg'];
    }
    if (unit === 'L') {
        return ['L', 'ml'];
    }
}




