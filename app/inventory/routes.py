from flask import render_template, request
from flask import redirect, url_for, flash
from flask_login import login_required, current_user
from .forms import SupplyInventoryForm, MermaForm
from app.utils.utils import create_log
from . import inventory
from app.models.models import db, Supplies, Inventory, Mermas
import json
from datetime import datetime, timedelta
from app.permissions import admin_permission

@inventory.route('/', methods=['GET'])
@login_required
def getInventory():
    inventory = Inventory.query.all()
    supplies = Supplies.query.all()
    lotes_caducados = []
    lotes_por_caducar = []
    inventoryJson = []
    print(inventory)
    for i in inventory:
        
        ijson = {
            'id' : i.id,
            'materia_prima': {supply.nombre for supply in supplies if supply.id == i.id_materia_prima},
            'stock': i.stock,
            'lote': i.lote,
            'fecha_compra': i.fecha_compra.strftime('%Y-%m-%d %H:%M:%S'),
            'fecha_caducidad': i.fecha_caducidad.strftime('%Y-%m-%d %H:%M:%S')
        }
        print(i.fecha_caducidad, datetime.now() - timedelta(days=3))
        if i.fecha_caducidad - timedelta(days=3) < datetime.now()  and i.fecha_caducidad > datetime.now():
            print("lotes por caducar: " + i.lote)
            lotes_por_caducar.append(i.lote)
        if i.fecha_caducidad < datetime.now():
            print("caducado: " + i.lote)
            lotes_caducados.append(i.lote)
        inventoryJson.append(ijson)
    print(inventoryJson)
    inventoryJson = json.dumps(inventoryJson)
    form = SupplyInventoryForm()
    if lotes_por_caducar:
            flash("Lotes por caducar: " + ', '.join(lotes_por_caducar), "warning")
    if lotes_caducados:
        flash("Lotes caducados: " + ', '.join(lotes_caducados), "danger")
    return render_template('supplies/inventory.html', form=form, inventory=inventory)

@inventory.route('/<int:id>', methods=['GET', 'POST'])
@login_required
def inventory_details(id):
    form = MermaForm()
    supply = Supplies.query.get(id)
    print(supply.nombre)
    lotes_caducados = []
    lotes_por_caducar = []
    inventory = Inventory.query.filter_by(id_materia_prima=id, en_stock = 1).all()
    inventoryJson = []
    print(inventory)
    for i in inventory:
        ijson = {
            'id' : i.id,
            'materia_prima': supply.nombre,
            'stock': i.stock,
            'lote': i.lote,
            'fecha_compra': i.fecha_compra.strftime('%Y-%m-%d %H:%M:%S'),
            'fecha_caducidad': i.fecha_caducidad.strftime('%Y-%m-%d %H:%M:%S')
        }
        print(i.fecha_caducidad, datetime.now() - timedelta(days=3))
        if i.fecha_caducidad - timedelta(days=3) < datetime.now()  and i.fecha_caducidad > datetime.now():
            print("lotes por caducar: " + i.lote)
            lotes_por_caducar.append(i.lote)
        if i.fecha_caducidad < datetime.now():
            print("caducado: " + i.lote)
            lotes_caducados.append(i.lote)
        inventoryJson.append(ijson)
    print(inventoryJson)
    if lotes_por_caducar:
            flash("Lotes por caducar: " + ', '.join(lotes_por_caducar), "warning")
    if lotes_caducados:
        flash("Lotes caducados: " + ', '.join(lotes_caducados), "danger")
    inventoryJson = json.dumps(inventoryJson)
    return render_template('supplies/inventory_details.html', supply=supply, unity= supply.unidad_medida, inventory=inventoryJson, form = form)

@inventory.route('/merma', methods=['POST'])
def merma():
    form = MermaForm(request.form)
    try:
        if form.validate():
            merma = Mermas(
                fecha = form.fecha.data,
                unidad_medida = form.unidad_medida.data,
                id_materia_prima = form.id_materia_prima.data,
                cantidad = form.cantidad.data,
                comentario = form.comentario.data,
                lote = form.lote.data
            )
            db.session.add(merma)
            db.session.flush()
            supply = Supplies.query.get(form.id_materia_prima.data)
            inventory = Inventory.query.filter_by(lote=form.lote.data).first()
            print(form.unidad_medida.data)
            print(merma.cantidad)
            converted = supply.convert_to(form.unidad_medida.data, merma.cantidad)
            print(converted)
            inventory.stock = inventory.stock - converted
            if inventory.stock == 0:
                inventory.en_stock = 0
            db.session.flush()
            supply.stock = supply.stock - converted
            db.session.flush()
            if supply.min_stock >= supply.stock:
                flash("Stock minimo alcanzado", "warning")
            if supply.stock <= 0:
                flash("Stock agotado", "danger")
            db.session.commit()
            create_log(id_usuario=current_user.id, tabla="Mermas", accion="Se ha registrado una merma de " + str(form.cantidad.data) + " " + form.unidad_medida.data + " de la materia prima " + supply.nombre, id_tabla=merma.id)
            flash("Merma registrada", "success")
            return redirect(url_for('inventory.inventory_details', id=form.id_materia_prima.data))
        else:
            error_messages = []
            for field, errors in form.errors.items():
                for error in errors:
                    error_messages.append(f'{getattr(form, field).label.text}: {error}')
            print(form.errors)
            flash("Error al registrar la merma: {}".format(' | '.join(error_messages)), "danger")
            return redirect(url_for('inventory.inventory_details', id=form.id_materia_prima.data))
    except Exception as e:
        db.session.rollback()
        flash("Error al registrar la merma", "danger")
        print(e)
        return redirect(url_for('inventory.inventory_details', id=form.id_materia_prima.data))
        