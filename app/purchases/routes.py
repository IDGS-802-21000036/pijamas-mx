from flask import render_template, request, flash, redirect, url_for
from flask_login import login_required
from . import purchases
from .forms import PurchaseForm
from app.models.models import db, Users, Purchases, PurchaseDetails, Suppliers, Supplies, SupplyDetails, Inventory
import json 
from datetime import datetime
from app.permissions import admin_permission, purchases_permissions

@purchases.route('/', methods=['GET', 'POST'])
@login_required
@purchases_permissions.require(http_exception=403)
def index():
    if admin_permission.can():
        add = True
    else:
        add = False
    form = PurchaseForm()
    users = Users.query.all()
    purchases = Purchases.query.all()
    suppliers = Suppliers.query.all()
    supplies = Supplies.query.all()
    relations = SupplyDetails.query.all()
    details = PurchaseDetails.query.all()
    
    purchasesData = [
        {
            'header': {
                'id': purchase.id,
                'usuario': [user.usuario for user in users if user.id == purchase.id_usuario][0],
                'proveedor': [supplier.nombre for supplier in suppliers if supplier.id == purchase.id_proveedor][0],
                'total': purchase.total,
                'fecha': purchase.fecha.strftime('%Y-%m-%d %H:%M:%S')
            },
            'details': [
                {
                    'materia_prima': [supply.nombre for supply in supplies if supply.id == detail.id_materia_prima][0],
                    'precio_lote': detail.precio_lote,
                    'contenido_unidad': detail.contenido_unidad,
                    'cantidad': detail.cantidad,
                    'unidad_medida': detail.unidad_medida
                }
                for detail in details if detail.id_compra == purchase.id
            ]
        }
        for purchase in purchases
    ]
    print(purchasesData)
    suppliers = [supplier for supplier in suppliers if supplier.status == 1]
    suppliersData = []
    matching_relations = [relation for relation in relations for supplier in suppliers if supplier.id == relation.id_proveedor]
    ids_proveedores = []
    for matching_relation in matching_relations:
        ids_proveedores.append(matching_relation.id_proveedor)
    ids_proveedores = list(set(ids_proveedores))
    suppliersMatching = [supplier for supplier in suppliers if supplier.id in ids_proveedores]
    for supplier in suppliersMatching:
                supplierData = {
                    **supplier.to_dict(),
                    'supplies': [supply.id for supply in supplies for relation in matching_relations if supply.id == relation.id_materia_prima and supplier.id == relation.id_proveedor]
                }
                suppliersData.append(supplierData)
    suppliesData = [supply.to_dict() for supply in supplies]
    suppliersData = json.dumps(suppliersData)
    suppliesData = json.dumps(suppliesData)
    
    print(suppliersData)
    print(suppliesData) 
    return render_template('purchases/purchases.html', add=add, form = form, purchases=purchasesData, suppliers=suppliersData, supplies=suppliesData)

@purchases.route('/save', methods=['POST'])
@admin_permission.require(http_exception=403)
@login_required
def save():
    form = PurchaseForm(request.form)
    try:
        if form.validate():
            supplies = Supplies.query.all()
            purchase = Purchases(
                id_usuario=1,
                id_proveedor=form.proveedor_id.data,
                total=form.total.data,
                fecha=form.fecha.data
            )
            db.session.add(purchase)
            db.session.flush()
            # No hagas commit de la compra todavía
            detalles_data = json.loads(form.detalles.data)
            print(detalles_data)
            for detail in detalles_data:
                print(detail)
                supplieSelected = [supply for supply in supplies if supply.id == detail['id_insumo']][0]
                print(supplieSelected.max_stock)
                converted = supplieSelected.convert_to(detail['unidad'], detail['contenido_por_unidad'])
                print(converted)
                if supplieSelected.max_stock < converted*detail['cantidad']+supplieSelected.stock:
                    flash('The stock of the supply {} exceeds the maximum stock'.format(supplieSelected.nombre), 'danger')
                    db.session.rollback()  # Deshacer todos los cambios si ocurre un error
                    return redirect(url_for('purchases.index'))  # Redirige al usuario si hay un error
                print("creando el objeto de purchase detail")
                purchase_detail = PurchaseDetails(
                    id_compra=purchase.id,
                    id_materia_prima=detail['id_insumo'],
                    precio_lote=detail['precio_lote'],
                    contenido_unidad=detail['contenido_por_unidad'],
                    cantidad=detail['cantidad'],
                    unidad_medida=detail['unidad']
                )
                db.session.add(purchase_detail)
                print("buscando el ultimo registro de inventario")
                last_inv = Inventory.query.filter_by(id_materia_prima=detail['id_insumo']).order_by(Inventory.id.desc()).first()
                
                print("creando el objeto de inventory")
                
                fecha_caducidad_str = detail['fecha_caducidad'].replace('T', ' ')
                fecha_caducidad = datetime.strptime(fecha_caducidad_str, '%Y-%m-%d %H:%M')
                print("fecha caducidad", fecha_caducidad)
                inventory = Inventory(
                    id_materia_prima=detail['id_insumo'],
                    stock_inicial=converted*detail['cantidad'],
                    stock=converted*detail['cantidad'],
                    lote = supplieSelected.nombre[0:3] + datetime.now().strftime('%Y%m%d%H%M%S') + (str(last_inv.id+1) if last_inv else '1'),
                    fecha_compra = purchase.fecha,
                    fecha_caducidad= fecha_caducidad
                )
                db.session.add(inventory)
                supplieSelected.stock += converted*detail['cantidad']
                db.session.add(supplieSelected)
            db.session.commit()  # Ahora puedes hacer commit de la compra y los detalles
            flash('Purchase saved successfully', 'success')
        else:
            error_messages = []
            for field, errors in form.errors.items():
                for error in errors:
                    error_messages.append(f'{getattr(form, field).label.text}: {error}')
            print(form.errors)
            flash('Error saving purchase: {}'.format(' | '.join(error_messages)), 'danger')
    except Exception as e:
        db.session.rollback()  # Deshacer todos los cambios si ocurre un error
        flash('Error saving purchase {}'.format(e), 'danger')
        print(e)
    return redirect(url_for('purchases.index'))
