from flask import render_template, request
from flask import redirect, url_for, flash
from flask_login import login_required, current_user
from .forms import SupplierForm, SupplyDetailsForm
from app.utils.utils import create_log
from . import suppliers
from app.models.models import db, Suppliers, Supplies, SupplyDetails
from app.permissions import admin_permission, suppliers_permissions
import json



@suppliers.route('/', methods=['GET', 'POST'])
@suppliers_permissions.require(http_exception=403)
@login_required
def index():
    if admin_permission.can():
        add = True
    else:
        add = False
    supply_details_form = SupplyDetailsForm()
    form = SupplierForm()
    supplies = Supplies.query.all()
    supplies_list = []
    if request.method == 'POST':
        status = request.form.get('status')
    else:
        status = '1'
    suppliers = Suppliers.query.filter_by(status=status).all()
    for supplier in suppliers:
        supply_details = SupplyDetails.query.filter_by(id_proveedor=supplier.id).all()
        insumos = {
            'id' : supplier.id,
            'supplies_list' : [supplier.id_materia_prima for supplier in supply_details]
        }
        print(insumos)
        supplies_list.append(insumos)
    supplies = [supply.to_dict() for supply in supplies]
    supplies = json.dumps(supplies)
    supplies_list = json.dumps(supplies_list)
    print(supplies_list)
    return render_template("suppliers/suppliers.html", add=add, suppliers=suppliers, form=form, supplies = supplies, supplies_list = supplies_list, status=status, supply_details_form=supply_details_form)

@suppliers.route('/save', methods=['POST'])
@login_required
@admin_permission.require(http_exception=403)
def save():
    form = SupplierForm(request.form)
    print("entro al post")
    try:
        print("entro al try")
        if form.validate():
            if form.id.data != 0:
                print(form.id.data)
                supplier = Suppliers.query.filter_by(id = form.id.data).first()
                print(supplier)
                 # Crea un nuevo registro Log para la modificación del proveedor
                if supplier == None:
                    flash('Supplier not found', 'danger')
                    return redirect(url_for('suppliers.index'))
                supplier.nombre = form.nombre.data
                supplier.rfc = form.rfc.data
                supplier.correo = form.correo.data
                supplier.telefono = form.telefono.data
                db.session.commit()
                create_log(id_usuario=current_user.id, accion='update', tabla='suppliers', id_tabla=supplier.id)
                
                flash('Supplier updated successfully', 'success')
                return redirect(url_for('suppliers.index'))
            else:
                supplier = Suppliers(nombre = form.nombre.data, 
                            rfc = form.rfc.data, 
                            correo = form.correo.data,
                            telefono = form.telefono.data)
                print("supplier creado")
                db.session.add(supplier)
                db.session.commit()
                create_log(id_usuario=current_user.id, accion='insert', tabla='suppliers', id_tabla=supplier.id)
                
                print("supplier guardado")
                flash('Proveedor guardado correctamente', 'success')
                return redirect(url_for('suppliers.index'))
        else:
            print(form.errors)
            error_messages = []
            for field, errors in form.errors.items():
                for error in errors:
                    error_messages.append(f"{field}: {error}")
            flash('Error al guardar al proveedor: {}'.format(', '.join(error_messages)), 'danger')
            return redirect(url_for('suppliers.index'))
    except Exception as e:
        print(e)
        flash('Hubo un error en el servidor al guardar al proveedor', 'danger')
        return redirect(url_for('suppliers.index'))

@suppliers.route('/delete', methods=['POST'])
@login_required
@admin_permission.require(http_exception=403)
def delete():
    id = request.form.get('id')
    supplier = Suppliers.query.filter_by(id = id).first()
    supplier.status = 0
    db.session.commit()
    create_log(id_usuario=current_user.id, accion='update', tabla='suppliers', id_tabla=supplier.id)
    
    flash('Proveedor desactivado correctamente', 'success')
    return redirect(url_for('suppliers.index'))

@suppliers.route('/activate', methods=['POST'])
@login_required
@admin_permission.require(http_exception=403)
def activate():
    id = request.form.get('id')
    supplier = Suppliers.query.filter_by(id = id).first()
    supplier.status = 1
    db.session.commit()
    create_log(id_usuario=current_user.id, accion='update', tabla='suppliers', id_tabla=supplier.id)
    
    flash('Proveedor activado correctamente', 'success')
    return redirect(url_for('suppliers.index'))

@suppliers.route('/save_supplies', methods=['POST'])
@login_required
@admin_permission.require(http_exception=403)
def save_supplies():
    form = SupplyDetailsForm(request.form)
    print("entrando a save_supplies")
    try:
        if form.validate():
            print("form validado")
            relationships = SupplyDetails.query.filter_by(id_proveedor=form.supplier_id.data).all()
            print(relationships)
            SupplyDetails.query.filter_by(id_proveedor=form.supplier_id.data).delete()
            db.session.commit()
            for relationship in relationships:
                create_log(current_user.id, 'delete', 'detalles_materias_primas',  f'{relationship.id_proveedor}-{relationship.id_materia_prima}')
            
            if form.supplies_ids.data:
                for supply_id in form.supplies_ids.data.split(','):
                    supplier_id = form.supplier_id.data
                    supply_id = int(supply_id)
                    supply_detail = SupplyDetails(id_proveedor=supplier_id, id_materia_prima=supply_id)
                    db.session.add(supply_detail)
                    db.session.commit()
                    create_log(current_user.id, 'insert', 'detalles_materias_primas', f'{supplier_id}-{supply_id}')
                flash('Insumo(s) añadido(s) al proveedor correctamente', 'success')
                return redirect(url_for('suppliers.index'))
            else:
                flash('Error añadiendo insumos al proveedor: Insumo(s) no seleccionado(s)', 'danger')
                return redirect(url_for('suppliers.index'))
        else:
            error_messages = []
            for field, errors in form.errors.items():
                for error in errors:
                    error_messages.append(f"{field}: {error}")
            flash('Error al añadir el(los) insumo(s) al proveedor: {}'.format(', '.join(error_messages)), 'danger')
            return redirect(url_for('suppliers.index'))
    except Exception as e:
        print(e)
        flash('Hubo un error en el servidor al guardar el(los) insumo(s) del proveedor', 'danger')
        return redirect(url_for('suppliers.index'))



