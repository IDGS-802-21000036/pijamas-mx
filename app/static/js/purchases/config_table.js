export function getSupplies(data){
    tableRows = data.map(supply => {
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