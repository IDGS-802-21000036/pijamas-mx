from flask import render_template, request, flash, redirect, url_for
from flask_login import login_required
from .forms import productionForm, updateRequestForm
from . import production
from app.models.models import db, Production, Recetas, Supplies, Detalles_receta, Inventory, Cookies_stock, Galletas, ProductionRequest, Users
from app.permissions import production_permissions
from datetime import datetime
from datetime import timedelta

@production.route('/', methods=['GET', 'POST'])
@production_permissions.require(http_exception=403)
@login_required
def index():
    solicitud = db.session.query(ProductionRequest.fecha,ProductionRequest.status, ProductionRequest.id, Recetas.nombre_receta, Users.usuario).join(Recetas).join(Users).all()
    form = productionForm()
    production = Production.query.join(Recetas).all()
    recetas = Recetas.query.all()
    return render_template("production/production.html", productions=production, recetas=recetas, form=form, solicitudes=solicitud)

@production.route('/save_production', methods=['POST'])
@login_required
def save_production():
    form = productionForm(request.form)
    print(form.data)
    try:
     if form:
         
        nueva_produccion = Production(
            cantidad_producida= 0,
            id_receta=form.id_receta.data,
            fecha_produccion=datetime.now(),
            status=0
        )

        db.session.add(nueva_produccion)
        db.session.commit()
        flash("Producción agregada a la cola correctamente.",'success')
        return redirect(url_for('production.index'))
     else:
        flash("Formulario de producción no válido.", "danger")
        return redirect(url_for('production.index'))
    except Exception as e:
        print(e)
        flash("Error al guardar la producción.", "danger")
        return redirect(url_for('production.index'))

@production.route('/update_request_status', methods=['POST'])
# @ventas_permission.require(http_exception=403)
@login_required
def update_request_status():
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
    return redirect(url_for('production.index'))

@production.route('/update_status', methods=['POST'])
@production_permissions.require(http_exception=403)
@login_required
def update_status():

    form = productionForm(request.form)
    print(form.data)
    """ 0=En cola, 1=En produccion, 2=En horno, 3=En empaque, 4=Terminado"""
    if form.id_receta.data == 0:
        print("No hay receta seleccionada.")
        produccion = Production.query.get(form.id.data)
        print("status inicial: ", produccion.status)
        receta = Recetas.query.get(produccion.id_receta)
        if receta:
            fecha_actual = datetime.now()
            detalles_receta = Detalles_receta.query.filter_by(id_receta=produccion.id_receta).all()
            for detalle in detalles_receta:
                materia_prima = Supplies.query.get(detalle.id_materia_prima)
                inventario = Inventory.query.filter(Inventory.id_materia_prima == detalle.id_materia_prima,
                                                    Inventory.fecha_caducidad > fecha_actual,
                                                    Inventory.stock > detalle.cantidad
                ).first()
                if not inventario:
                    flash(f"No hay suficiente {materia_prima.nombre} para hacer la producción.")
                    return redirect(url_for('production.index'))
                else:
                    print("Fecha caducidad: ", inventario.fecha_caducidad)
                    print("fecha actual: " , fecha_actual)
            for detalle in detalles_receta:
                materia_prima = Supplies.query.get(detalle.id_materia_prima)
                inventario = Inventory.query.filter(Inventory.id_materia_prima == detalle.id_materia_prima,
                                                    Inventory.fecha_caducidad > fecha_actual,
                                                    Inventory.stock > detalle.cantidad
                ).first()
                if inventario:
                    inventario.stock -= detalle.cantidad
                    db.session.add(inventario)
                    db.session.commit()
                    
            produccion.status = form.id_receta.data+1       
            db.session.add(produccion)
            db.session.commit()
            flash("Producción comenzada.")
            return redirect(url_for('production.index'))
        else:
            flash("Receta no encontrada.")
            return redirect(url_for('production.index'))
    if form.id_receta.data == 1:
        produccion = Production.query.get(form.id.data)
        if produccion:
            produccion.status = form.id_receta.data+1
            db.session.add(produccion)
            db.session.commit()
            flash("Producción en horno.")
            return redirect(url_for('production.index'))
        else:
            flash("Receta no encontrada.")
            return redirect(url_for('production.index'))
    if form.id_receta.data == 2:
        fecha_actual = datetime.now()
        produccion = Production.query.get(form.id.data)
        if produccion:
            receta = Recetas.query.get(produccion.id_receta)
            if not receta:
                flash("Receta no encontrada.")
                return redirect(url_for('production.index'))
            galleta = Galletas.query.get(receta.id_galleta)
            if not galleta:
                flash("Galleta no encontrada.")
                return redirect(url_for('production.index'))
            produccion.status = form.id_receta.data+1
            produccion.fecha_produccion = fecha_actual
            produccion.cantidad_producida = receta.cantidad_produccion
            print("Fecha de produccion: ", produccion.fecha_produccion)
            db.session.add(produccion)
            db.session.commit()
            flash("Producción en empaque.")
            return redirect(url_for('production.index'))
        else:
            flash("Receta no encontrada.")
            return redirect(url_for('production.index'))
    if form.id_receta.data == 3:
        fecha_actual = datetime.now()
        produccion = Production.query.get(form.id.data)
        if produccion:
            receta = Recetas.query.get(produccion.id_receta)
            if not receta:
                flash("Receta no encontrada.")
                return redirect(url_for('production.index'))
            galleta = Galletas.query.get(receta.id_galleta)
            if not galleta:
                flash("Galleta no encontrada.")
                return redirect(url_for('production.index'))
            nuevo_stock =  Cookies_stock(
            id_produccion = produccion.id,
            id_galleta = receta.id_galleta,
            stock = receta.cantidad_produccion,
            lote = "Lote"+str(galleta.id)+str(fecha_actual.year)+str(fecha_actual.month)+str(fecha_actual.day),
            fecha_caducidad = fecha_actual + timedelta(days=15)
            )
            produccion.status = form.id_receta.data+1
            db.session.add(produccion)
            db.session.add(nuevo_stock)
            db.session.commit()
            flash("Producción terminada.")
            return redirect(url_for('production.index'))
        else:
            flash("Producción no encontrada.")
            return redirect(url_for('production.index'))
    else:    
        flash("Receta no encontrada.")
        return redirect(url_for('production.index'))
    production = Production.query.filter_by(status=status).all()
    return render_template("production/production.html", production=production, form=form, status=status)