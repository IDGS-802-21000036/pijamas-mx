from flask import render_template, request, flash, redirect, url_for,jsonify
from flask_login import login_required
from .forms import recetaForm
from . import recetas
from app.models.models import db, Recetas,Galletas,Supplies,Detalles_receta
from app.permissions import admin_permission
import json


@recetas.route('/', methods=['GET', 'POST'])
@admin_permission.require(http_exception=403)
@login_required
def index():
    form = recetaForm()
    status = request.form.get('status', '1')
    recetas = Recetas.query.filter_by(status=status).all()
    galletas = Galletas.query.filter_by(status=status).all()
    galletas_data = [{'id': galleta.id, 'nombre_galleta': galleta.nombre_galleta} for galleta in galletas]
    materia_prima = Supplies.query.all()
    materia_prima_data = [{'id': materia.id, 'nombre': materia.nombre, 'unidad_medida': materia.unidad_medida} for materia in materia_prima]   
    
    detalles_receta = Detalles_receta.query.join(Supplies, Detalles_receta.id_materia_prima == Supplies.id) \
        .add_columns(Supplies.nombre, Detalles_receta.cantidad, Detalles_receta.id_receta, Supplies.unidad_medida) \
        .all()
    
    detalles_json = [{
        'nombre': detalle[1],
        'cantidad': detalle[2],
        'unidad_medida': detalle[4],
        'id_receta': detalle[3]
    } for detalle in detalles_receta]
    
    print(detalles_json)

    return render_template("recetas/recetas.html", recetas=recetas, form=form, status=status, galletas=galletas_data, materias=materia_prima_data, detalles_json=detalles_json)


@recetas.route('/save_detalles', methods=['POST'])
@admin_permission.require(http_exception=403)
@login_required
def save_detalles():
    try:
        detalles_receta = json.loads(request.form.get('detalles_receta'))

        for detalle in detalles_receta:
            detalle_receta = Detalles_receta(
                id_receta=detalle['id_receta'],  # Corregido aquí
                id_materia_prima=detalle['id_materia_prima'],
                cantidad=detalle['cantidad']
            )
            db.session.add(detalle_receta)

        db.session.commit()
        flash('Detalles de la receta guardados correctamente', 'success')
        return redirect(url_for('recetas.index'))

    except Exception as e:
        db.session.rollback()
        flash('Error al guardar detalles de la receta', 'danger')
        return redirect(url_for('recetas.index'))



@recetas.route('/save', methods=['POST'])
@admin_permission.require(http_exception=403)
@login_required
def save():
    form = recetaForm(request.form)
    try:
        if form.validate():
            if form.id.data != 0:
                receta = Recetas.query.get(form.id.data)
                if not receta:
                    flash('Receta not found', 'danger')
                    return redirect(url_for('recetas.index'))
                receta.nombre_receta = form.nombre_receta.data
                receta.descripcion = form.descripcion.data
                receta.cantidad_produccion = form.cantidad_produccion.data
                receta.id_galleta = form.galleta.data  # Corregido aquí
                flash('Receta updated successfully', 'success')
            else:
                receta = Recetas(nombre_receta=form.nombre_receta.data,
                                 descripcion=form.descripcion.data,
                                 cantidad_produccion=form.cantidad_produccion.data,
                                 id_galleta=form.galleta.data)  # Corregido aquí
                db.session.add(receta)
                flash('Receta added successfully', 'success')
            db.session.commit()
            return redirect(url_for('recetas.index'))
        else:
            error_messages = "; ".join([f"{field}: {', '.join(errors)}" for field, errors in form.errors.items()])
            flash(f'Error al agregar receta: {error_messages}', 'danger')
            return redirect(url_for('recetas.index'))
    except Exception as e:
        db.session.rollback()
        flash('Error al agregar receta', 'danger')
        return redirect(url_for('recetas.index'))



@recetas.route('/delete', methods=['POST'])
@admin_permission.require(http_exception=403)
@login_required
def delete():
    id = request.form.get('id')
    receta = Recetas.query.get(id)
    if receta:
        receta.status = 0
        db.session.commit()
        flash('Receta deactivated successfully', 'success')
    else:
        flash('Receta not found', 'danger')
    return redirect(url_for('recetas.index'))

@recetas.route('/activate', methods=['POST'])
@login_required
def activate():
    id = request.form.get('id')
    receta = Recetas.query.get(id)
    if receta:
        receta.status = 1
        db.session.commit()
        flash('Receta activated successfully', 'success')
    else:
        flash('Receta not found', 'danger')
    return redirect(url_for('recetas.index'))
