from flask import render_template, request, flash, redirect, url_for
from flask_login import login_required
from .forms import galletaForm
from . import galletas
from app.models.models import db, Galletas
from app.permissions import admin_permission

@galletas.route('/', methods=['GET', 'POST'])
@admin_permission.require(http_exception=403)
@login_required
def index():
    form = galletaForm()
    status = request.form.get('status', '1')
    galletas = Galletas.query.filter_by(status=status).all()
    return render_template("galletas/galletas.html", galletas=galletas, form=form, status=status)
@galletas.route('/save', methods=['POST'])
@login_required
def save():
    form = galletaForm(request.form)
    try:
        if form.validate():
            if form.id.data != 0:
                galleta = Galletas.query.get(form.id.data)
                if not galleta:
                    flash('Galleta not found', 'danger')
                    return redirect(url_for('galletas.index'))
                galleta.nombre_galleta = form.nombre_galleta.data
                galleta.precio_unitario = form.precio_unitario.data
                galleta.precio_kilo = form.precio_kilo.data
                galleta.descripcion = form.descripcion.data
                galleta.peso_galleta = form.peso_galleta.data
                flash('Galleta updated successfully', 'success')
            else:
                galleta = Galletas(nombre_galleta=form.nombre_galleta.data,
                                   precio_unitario=form.precio_unitario.data,
                                   precio_kilo=form.precio_kilo.data,
                                   descripcion=form.descripcion.data,
                                   peso_galleta=form.peso_galleta.data)
                db.session.add(galleta)
                flash('Galleta added successfully', 'success')
            db.session.commit()
            return redirect(url_for('galletas.index'))
        else:
            error_messages = "; ".join([f"{field}: {', '.join(errors)}" for field, errors in form.errors.items()])
            flash(f'Error al agregar galleta, introdusca solo caracteres validos', 'danger')
            return redirect(url_for('galletas.index'))
    except Exception as e:
        db.session.rollback()
        flash(f'Error al agregar galleta, introdusca solo caracteres validos', 'danger')  # Convertir el error a cadena de texto
        return redirect(url_for('galletas.index'))

@galletas.route('/delete', methods=['POST'])
@admin_permission.require(http_exception=403)
@login_required
def delete():
    id = request.form.get('id')
    galleta = Galletas.query.get(id)
    if galleta:
        galleta.status = 0
        db.session.commit()
        flash('Supplier deactivated successfully', 'success')
    else:
        flash('Galleta not found', 'danger')
    return redirect(url_for('galletas.index'))

@galletas.route('/activate', methods=['POST'])
@admin_permission.require(http_exception=403)
@login_required
def activate():
    id = request.form.get('id')
    galleta = Galletas.query.get(id)
    if galleta:
        galleta.status = 1
        db.session.commit()
        flash('Supplier activated successfully', 'success')
    else:
        flash('Galleta not found', 'danger')
    return redirect(url_for('galletas.index'))
