from flask import render_template, request, flash, redirect, url_for
from flask_login import login_required
from .forms import salesForm, productionRequestForm, salesDelete, updateRequestForm
from . import sales
import re, os
import json
from app.models.models import db, Production, Recetas, Cookies_stock, Galletas, ProductionRequest, Users, Ventas, Detalles_venta
from app.permissions import ventas_permission
from datetime import datetime
from datetime import timedelta

@sales.route('/', methods=['GET', 'POST'])
# @ventas_permission.require(http_exception=403)
@login_required
def index():
    form = salesForm()
    recetas = Recetas.query.all()
    ventas = Ventas.query.join(Users).all()
    galletas = Galletas.query.all()
    production = Production.query.join(Recetas).all()
    solicitud = db.session.query(ProductionRequest.fecha,ProductionRequest.status, ProductionRequest.id, Recetas.nombre_receta, Users.usuario).join(Recetas).join(Users).all()
    
    # Verificar si el archivo JSON existe
    if os.path.exists('temp_file.json'):
        # Abrir el archivo en modo de lectura y cargar los datos
        with open('temp_file.json', 'r') as file:
            sales_data = json.load(file)
    else:
        # Si el archivo no existe, inicializar sales_data como un diccionario vacío
        sales_data = {}

    total = 0
    for venta in sales_data.values():
        total += venta['subtotal']
        
    return render_template("sales/sales.html", galletas=galletas, recetas=recetas, form=form, solicitudes=solicitud, productions=production, sales_data=sales_data, total=total, ventas=ventas)

@sales.route('/save_sale', methods=['POST'])
@login_required
def save_sale():
    form = salesForm(request.form)
    if form.validate:
        stock_galleta = db.session.query(Cookies_stock, Galletas).filter_by(id_galleta=form.id_galleta.data).join(Galletas).first()
        if not stock_galleta:
            flash("Galleta sin stock.", "danger")
        elif form.unidad.data == 'pz':
            if stock_galleta.Cookies_stock.stock >= form.cantidad.data:
                save_sale_to_json(stock_galleta, form)
                flash("Venta realizada correctamente.", "success")
            else:
                flash("No hay suficiente stock de galletas.", "danger")
        elif form.unidad.data == 'kg':
            if enough_stock_in_kg(stock_galleta, form):
                save_sale_to_json(stock_galleta, form)
                flash("Venta realizada correctamente.", "success")
            else:
                flash("No hay suficiente stock de galletas.", "danger")
        else:
            flash("Unidad de medida no válida.", "danger")
    else:
        flash("Formulario de venta no válido.", "danger")
    return redirect(url_for('sales.index'))

def enough_stock_in_kg(stock_galleta, form):
    peso_galleta = stock_galleta.Galletas.peso_galleta
    cantidad_kg = form.cantidad.data
    cantidad_galletas = stock_galleta.Cookies_stock.stock * peso_galleta / 1000
    return cantidad_galletas > cantidad_kg

def save_sale_to_json(stock_galleta, form):
    # Check if the file exists
    if os.path.exists('temp_file.json'):
        # Abre el archivo en modo de lectura y carga los datos existentes
        with open('temp_file.json', 'r') as file:
            data = json.load(file)
    else:
        # Si el archivo no existe, inicializa los datos como un diccionario vacío
        data = {}

    # Genera un ID único para la nueva entrada
    new_id = len(data) + 1

    # Calcula la cantidad en base a la unidad de medida
    if form.unidad.data == 'pz':
        cantidad = form.cantidad.data
        subtotal = form.cantidad.data * stock_galleta.Galletas.precio_unitario
        precio_unitario = stock_galleta.Galletas.precio_unitario
    elif form.unidad.data == 'kg':
        peso_galleta = stock_galleta.Galletas.peso_galleta
        cantidad = int((form.cantidad.data * 1000) / peso_galleta)
        subtotal = form.cantidad.data * stock_galleta.Galletas.precio_kilo
        precio_unitario = stock_galleta.Galletas.precio_kilo
    else:
        flash("Unidad de medida no válida.", "danger")
        return

    # Agrega la nueva entrada al diccionario de datos
    data[new_id] = {
        "galleta_id": stock_galleta.Galletas.id,
        "nombre_galleta": stock_galleta.Galletas.nombre_galleta,
        "unidad": form.unidad.data,
        "cantidad": form.cantidad.data,
        "cookies_stock_id": stock_galleta.Cookies_stock.id,
        "cantidad_pz" : cantidad,
        "subtotal": subtotal,
        "precio_unitario": precio_unitario,
    }

    # Guarda los datos actualizados en el archivo JSON
    with open('temp_file.json', 'w') as file:
        json.dump(data, file)

@sales.route('/production_request', methods=['POST'])
# @ventas_permission.require(http_exception=403)
@login_required
def production_request():
    form = productionRequestForm(request.form)
    print(form.data)
    if form.id.data == 0:
        nueva_solicitud = ProductionRequest(
            id_usuario=form.id_usuario.data,
            id_receta=form.id_receta.data,
            status=0
        )
        db.session.add(nueva_solicitud)
        db.session.commit()
        flash("Solicitud de producción agregada a la cola correctamente.", "success")
        return redirect(url_for('sales.index'))
    return redirect(url_for('sales.index'))

@sales.route('/update_status', methods=['POST'])
# @ventas_permission.require(http_exception=403)
@login_required
def update_status():
    form= updateRequestForm(request.form)
    if form.id.data == 0:
        flash("No hay solicitud seleccionada.", "danger")
    solicitud = ProductionRequest.query.get(form.id.data)
    if solicitud:
        solicitud.status = form.status.data
        db.session.add(solicitud)
        db.session.commit()
        flash("Solicitud actualizada.", "success")
    else:
        flash("Solicitud no encontrada.", "danger")
    return redirect(url_for('sales.index'))
    
@sales.route('/sales_delete', methods=['POST'])
@login_required
def sales_delete():
    form = salesDelete(request.form)
    if form:
        sales_id = form.id.data
        if sales_id != 0:
            print(f"ID de venta a eliminar: {sales_id}")
            if os.path.exists('temp_file.json'):
                with open('temp_file.json', 'r') as file:
                    data = json.load(file)
                print("Datos cargados del archivo:")
                print(data)
            else:
                data = {}

            # Verificamos si el ID existe en los datos
            if str(sales_id) in data:
                # Eliminamos el objeto del diccionario
                data.pop(str(sales_id), None)
                print("Datos después de eliminar la venta:")
                print(data)
                # Reorganizamos los IDs para que sean consecutivos
                new_data = {}
                new_id = 1
                for key in sorted(data.keys()):
                    new_data[str(new_id)] = data[key]
                    new_id += 1
                # Guardamos los datos actualizados en el archivo
                with open('temp_file.json', 'w') as file:
                    json.dump(new_data, file)
                flash("Venta eliminada correctamente.", "danger")
            else:
                flash("ID de venta no encontrado en los datos.", "danger")
        else:
            flash("Venta no válida.", "danger")
    else:
        flash("Error en el formulario de eliminación de ventas.", "danger")
    return redirect(url_for('sales.index'))

@sales.route('/generate_sale', methods=['POST'])
@login_required
def generate_sale():
    if os.path.exists('temp_file.json'):
        with open('temp_file.json', 'r') as file:
            data = json.load(file)
        print("Datos cargados del archivo:")
        print(data)
    else:
        data = {}
    if data:
        subtotal_total = 0
        for key in data:
            venta = data[key]
            subtotal_total += venta['subtotal']
            
        venta = Ventas(
            id_usuario=1,
            total=subtotal_total
        )
        db.session.add(venta)
        db.session.flush()
        venta_id = venta.id
        try:
            for key in data:
                venta = data[key]

                detalle_venta = Detalles_venta(
                    id_venta=venta_id,
                    id_galleta=venta['galleta_id'],
                    presentacion=venta['unidad'],
                    cantidad=venta['cantidad_pz'],
                    precio=venta['subtotal']
                )
                db.session.add(detalle_venta)
                stock = Cookies_stock.query.filter_by(id=venta['cookies_stock_id']).first()
                stock.stock -= venta['cantidad_pz']
                db.session.add(stock)
            db.session.commit()
            flash("Ventas realizadas correctamente.", "success")
            os.remove('temp_file.json')
        except Exception as e:
            db.session.rollback()
            flash("Error al generar las ventas. Detalles: " + str(e), "danger")
        return redirect(url_for('sales.index'))
    else:
        flash("No hay ventas pendientes para generar.")
    return redirect(url_for('sales.index'))