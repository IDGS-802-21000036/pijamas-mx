from flask import render_template, request, jsonify
from flask import redirect, url_for, flash
from flask_login import login_required, current_user
from app.utils.utils import create_log
from .forms import SuppliesForm
from . import supplies
from app.models.models import db, Supplies
from app.permissions import admin_permission

@supplies.route('/')
@login_required
def index():
    if admin_permission.can():
        add = True
    else:
        add = False
    form = SuppliesForm()
    supplies = Supplies.query.all()
    print("lista de supplies")
    print(supplies)
    return render_template("supplies/supplies.html", add = add, supplies=supplies, form = form)

@supplies.route('/save', methods=['POST'])
@admin_permission.require(http_exception=403)
@login_required
def save():
    form = SuppliesForm(request.form)
    try:

        if form.validate():
            if form.id.data != 0:
                supply = Supplies.query.filter_by(id=form.id.data).first()
                if supply is None:
                    flash('(Insumo no encontrada', 'danger')
                    return redirect(url_for('supplies.index'))
                supply.nombre = form.nombre.data
                supply.descripcion = form.descripcion.data
                supply.stock = form.stock.data
                supply.unidad_medida = form.unidad_medida.data
                supply.save()
                create_log("Se ha modificado el Insumo: " + supply.nombre, accion="update", tabla="materias_primas", id_tabla=supply.id)
                flash("Se ha modificado el Insumo: " + supply.nombre, "success")
                return redirect(url_for('supplies.index'))
            else:
                supply = Supplies(nombre = form.nombre.data, 
                                  descripcion = form.descripcion.data, 
                                  stock = 0,
                                  min_stock = form.min_stock.data,
                                  max_stock = form.max_stock.data,
                                  unidad_medida = form.unidad_medida.data)
                db.session.add(supply)
                db.session.commit()
                
                create_log(id_usuario= current_user.id,accion = "Se ha registrado un Insumo: " + supply.nombre, tabla="materias_primas", id_tabla=supply.id)
                flash("Se ha registrado el Insumo: " + supply.nombre, "success")
                return redirect(url_for('supplies.index'))
        else:
            error_messages = "; ".join([f"{field}: {', '.join(errors)}" for field, errors in form.errors.items()])
            flash(f'Error al agregar insumo, introdusca solo caracteres validos', 'danger')
            return redirect(url_for('supplies.index'))
    except Exception as e:
        print(e)
        flash('Error al añadir la Insumo: {}'.format(e), 'danger')
        return redirect(url_for('supplies.index'))
