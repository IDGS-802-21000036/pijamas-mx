var jsonData = JSON.parse(document.getElementById('inventoryData').getAttribute('data-inventory'));
var unity = document.getElementById('inventoryData').getAttribute('data-unity');
var id_materia_prima = document.getElementById('inventoryData').getAttribute('data-id');
console.log(id_materia_prima);
let units = {
    'pz': 'piezas',
    'L': 'litros',
    'kg': 'kilogramos'
};


$('#tblInventory').DataTable({
    lengthChange: true,
    pageLength: 10,
    responsive: true,
    data: jsonData,
    columns: [
        { data: 'stock', responsivePriority: 1, targets: 0, className: 'all' },
        { data: 'lote', responsivePriority: 2, targets: 1, className: 'all' },
        { data: 'fecha_caducidad', responsivePriority: 3, targets: 2, className: 'all' },
        { 
            data: 'id', 
            responsivePriority: 4, 
            targets: 3, 
            className: 'all',
            render: function(data, type, row) {
                return '<button class="btn btn-danger" onclick="addLost(' + data + ')"><i class="fa-solid fa-cookie-bite"></i></button>';
            }
        }
    ]
});



function addLost(id){
    if (unity == 'pz') {
        units =['pz']
    }
    else if (unity == 'L') {
        units =['ml', 'L']
    }
    else if (unity == 'kg') {
        units =['g', 'kg', 'mg' ]
    }
    const today = new Date();
    console.log(today);
    const date = formatDateToLocalISOString(today).slice(0,16);
    console.log(date);
    const dateExpiration = new Date(jsonData.find(item => item.id === id).fecha_caducidad);
    const dateExpirationFormatted = formatDateToLocalISOString(dateExpiration).slice(0,16);
    console.log(dateExpirationFormatted);
    const datePurchase = new Date(jsonData.find(item => item.id === id).fecha_compra);
    const datePurchaseFormatted = formatDateToLocalISOString(datePurchase).slice(0,16);
    
    Swal.fire({
        title: 'Registrar pérdida',
        html: `
            <h3>Stock actual: ${jsonData.find(item => item.id === id).stock} ${unity}</h3>
            <hr>
            <input type="text" readonly class="form-control mb-3" id="swallote" value=${jsonData.find(item => item.id === id).lote} min="1" max="999" placeholder="Lote">
            <input type="number" class="form-control mb-3" id="swalcantidad" min="1" max="999" placeholder="Cantidad perdida">
            <select name="unidad_medida" class="form-control mb-3">
                <option value="" disabled selected>Unidad de medida</option>
                ${units.map(unit => `<option value="${unit}">${unit}</option>`).join('')}
            </select>
            <textarea rows="4" cols="50" class="form-control mb-3" id="swalcomentario" placeholder="Comentario"></textarea>
            <input type="datetime-local" class="form-control mb-3" id="swalfecha" placeholder="Fecha de caducidad" min="${datePurchaseFormatted}" max="${date}">
        `,
        confirmButtonText: 'Guardar',
        focusConfirm: false,
        didOpen() { 
            if (today > dateExpiration){
                sendToMerma(id);
                return;
            }
            document.getElementById('swalfecha').onchange = function() {
                const selectedDateTime = new Date(this.value);
                const dateExpiration = new Date(dateExpirationFormatted);
                const datePurchase = new Date(datePurchaseFormatted);

                console.log("dateExpirationFormatted", dateExpiration);
                console.log("selectedDateTime", selectedDateTime);
                console.log("today", date);
                console.log("selectedDateTime", selectedDateTime, "date", today, "selected > date", selectedDateTime > today);
                if (selectedDateTime > today){
                    Swal.showValidationMessage('La fecha de caducidad no puede ser mayor a la fecha actual');
                    this.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();

                    this.value = date;
                }
                if (selectedDateTime < datePurchase) {
                    Swal.showValidationMessage('La fecha de caducidad no puede ser menor a la fecha de compra del insumo');
                    console.log("selectedDateTime", selectedDateTime);
                    this.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    this.value = datePurchaseFormatted;
                }
            };
        },
        preConfirm: () => {
            const fecha = document.getElementById('swalfecha');
            const lote = document.getElementById('swallote');
            const cantidad = document.getElementById('swalcantidad');
            const unidad_medida = document.querySelector('select[name="unidad_medida"]');
            const comentario = document.getElementById('swalcomentario');
            if (lote.value === null || lote.value === ""){
            Swal.fire({
                    title: "Error",
                    text: "Hubo un error al recuperar el lote",
                    icon: "error",
                    button: "OK",
                });
                return false;
            }
            
            if (!cantidad.value || !comentario.value || !unidad_medida.value || !fecha.value){
                Swal.showValidationMessage('Todos los campos son requeridos');
                if (!cantidad.value) cantidad.classList.add('is-invalid');
                if (!comentario.value) comentario.classList.add('is-invalid');
                if (!unidad_medida.value) unidad_medida.classList.add('is-invalid');
                if (!fecha.value) fecha.classList.add('is-invalid');
                removeInvalidClassAfterDelay();
                return false;
            }

            
            if (unity === 'pz'){
                if (!['pz'].includes(unidad_medida.value)) {
                    Swal.showValidationMessage('La unidad de medida no es válida');
                    unidad_medida.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (unidad_medida.value === 'pz' && parseFloat(cantidad.value) % 1 !== 0){
                    Swal.showValidationMessage('La cantidad perdida debe ser un número entero');
                    cantidad.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (unidad_medida.value === 'pz' && parseInt(cantidad.value) > jsonData.find(item => item.id === id).stock){
                    Swal.showValidationMessage('La cantidad perdida no puede ser mayor al stock en piezas');
                    cantidad.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (unidad_medida.value === 'pz' && parseInt(cantidad.value) < 1){
                    Swal.showValidationMessage('La cantidad perdida no puede ser menor a 1');
                    cantidad.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }

            }

            if (unity === 'L'){
                if (!['ml', 'L'].includes(unidad_medida.value)) {
                    Swal.showValidationMessage('La unidad de medida no es válida');
                    unidad_medida.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (unidad_medida.value === 'ml' && parseFloat(cantidad.value) > jsonData.find(item => item.id === id).stock * 1000){
                    Swal.showValidationMessage('La cantidad perdida no puede ser mayor al stock en mililitros');
                    cantidad.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (unidad_medida.value === 'L' && parseFloat(cantidad.value) > jsonData.find(item => item.id === id).stock){
                    Swal.showValidationMessage('La cantidad perdida no puede ser mayor al stock en litros');
                    cantidad.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (unidad_medida.value === 'ml' && parseFloat(cantidad.value) < 1){
                    Swal.showValidationMessage('La cantidad perdida no puede ser menor a 1');
                    cantidad.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (unidad_medida.value === 'L' && parseFloat(cantidad.value) < 1){
                    Swal.showValidationMessage('La cantidad perdida no puede ser menor a 1');
                    cantidad.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }

            }

            if (unity === 'kg'){ 
                if (!['g', 'kg', 'mg'].includes(unidad_medida.value)) {
                    Swal.showValidationMessage('La unidad de medida no es válida');
                    unidad_medida.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (unidad_medida.value === 'g' && parseFloat(cantidad.value) > jsonData.find(item => item.id === id).stock * 1000){
                    Swal.showValidationMessage('La cantidad perdida no puede ser mayor al stock en gramos');
                    cantidad.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (unidad_medida.value === 'mg' && parseFloat(cantidad.value) > jsonData.find(item => item.id === id).stock * 1000000){
                    Swal.showValidationMessage('La cantidad perdida no puede ser mayor al stock en miligramos');
                    cantidad.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (unidad_medida.value === 'kg' && parseFloat(cantidad.value) > jsonData.find(item => item.id === id).stock){
                    Swal.showValidationMessage('La cantidad perdida no puede ser mayor al stock en kilogramos');
                    cantidad.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (unidad_medida.value === 'g' && parseFloat(cantidad.value) < 1){
                    Swal.showValidationMessage('La cantidad perdida no puede ser menor a 1');
                    cantidad.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (unidad_medida.value === 'mg' && parseFloat(cantidad.value) < 1){
                    Swal.showValidationMessage('La cantidad perdida no puede ser menor a 1');
                    cantidad.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }
                if (unidad_medida.value === 'kg' && parseFloat(cantidad.value) < 1){
                    Swal.showValidationMessage('La cantidad perdida no puede ser menor a 0.001');
                    cantidad.classList.add('is-invalid');
                    removeInvalidClassAfterDelay();
                    return false;
                }

            }

            if (isNaN(cantidad.value) || parseFloat(cantidad.value) < 0) {
                Swal.showValidationMessage('La cantidad perdida debe ser un número y positivo');
                cantidad.classList.add('is-invalid');
                removeInvalidClassAfterDelay();
                return false;
            }

            if (comentario.value.length < 5) {
                Swal.showValidationMessage('El comentario debe tener al menos 5 caracteres');
                comentario.classList.add('is-invalid');
                removeInvalidClassAfterDelay();
                return false;
            }
            if(fecha.value === null || fecha.value === ""){
                Swal.showValidationMessage('La fecha de caducidad es requerida');
                fecha.classList.add('is-invalid');
                removeInvalidClassAfterDelay();
                return false;
            }
            if (fecha.value > dateExpirationFormatted){
                Swal.showValidationMessage('La fecha de caducidad no puede ser mayor a la fecha de caducidad del insumo');
                fecha.classList.add('is-invalid');
                removeInvalidClassAfterDelay();
                return false;
            }
            if (fecha.value < datePurchaseFormatted){ 
                Swal.showValidationMessage('La fecha de caducidad no puede ser menor a la fecha de compra del insumo');
                fecha.classList.add('is-invalid');
                removeInvalidClassAfterDelay();
                return false;
            }

            return {
                lote: lote.value,
                id_materia_prima: id_materia_prima, //id_materia_prima.value,
                cantidad: cantidad.value,
                unidad_medida: unidad_medida.value,
                comentario: comentario.value,
                fecha: fecha.value
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { lote, id_materia_prima, cantidad, unidad_medida, comentario, fecha } = result.value;

            document.getElementById('id_materia_prima').value = id_materia_prima;
            document.getElementById('lote').value = lote;
            document.getElementById('cantidad').value = cantidad;
            document.getElementById('unidad_medida').value = unidad_medida;
            document.getElementById('comentario').value = comentario;
            document.getElementById('fecha').value = fecha;
            document.getElementById('hiddenForm').submit();
        }
    });
}

function removeInvalidClassAfterDelay() {
    setTimeout(function() {
        document.querySelectorAll('.is-invalid').forEach(function(element) {
            element.classList.remove('is-invalid');
        });
    }, 5000);
}

function formatDateToLocalISOString(date) {
    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}

function sendToMerma(id){
    obj = jsonData.find(item => item.id === id);
    console.log(obj);
    console.log(obj.stock);
    Swal.fire({
        title: "Error",
        text: "El insumo ya caducó",
        icon: "error",
        button: "OK",
        allowOutsideClick: false,
    }).then(() => {
        document.getElementById('id_materia_prima').value = id_materia_prima;
        document.getElementById('lote').value = obj.lote;
        document.getElementById('cantidad').value = obj.stock;
        document.getElementById('unidad_medida').value = unity;
        document.getElementById('comentario').value = "Insumo caducado";
        document.getElementById('fecha').value = obj.fecha_caducidad;
        document.getElementById('hiddenForm').submit();

    });
}

