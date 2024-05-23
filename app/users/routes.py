from flask import render_template, request
from flask import redirect, url_for, flash
from flask_login import login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from .forms import UsersForm
from app.utils.utils import create_log
from . import  users
from app.models.models import db, Suppliers, Logs, Users, Roles, PasswordsHistory
from app.permissions import admin_permission



@users.route('/', methods=['GET', 'POST'])
@admin_permission.require(http_exception=403)
@login_required
def index():
    form = UsersForm()
    roles= Roles.query.all()
    if request.method == 'POST':
        status = request.form.get('status')
        users = Users.query.filter_by(status=status).all()
    else:
        status = '1'
        users = Users.query.filter_by(status=status).all()

    return render_template("users/users.html", users=users, form=form, status=status, roles=roles)

@users.route('/save', methods=['POST'])
@admin_permission.require(http_exception=403)
@login_required
def save():
    form = UsersForm(request.form)
    for field_name, field_value in form.data.items():
        print(f"{field_name}: {field_value}")
    print("entro al post")
    print("Tipo de form.id.data:", type(form.id.data))
    try:
        print("entro al try")
        if form.validate():
            print("Entro al if user")
            if form.id.data != 0:
                print("Entro al update user")
                print(form.id.data)
                user = Users.query.filter_by(id = form.id.data).first()
                print(user)
                if user == None:
                    flash('Usuario not found', 'danger')
                    return redirect(url_for('users_bp.index'))
                else:
                    passw = generate_password_hash(form.contrasenia.data, method='scrypt')
                    passw_binary = passw.encode('utf-8')
                    user.usuario = form.usuario.data
                    user.correo = form.correo.data
                    user.contrasenia = passw_binary
                    user.rol_id = form.rol_id.data
                    db.session.commit()
                    create_log(id_usuario=current_user.id, accion='update', tabla='usuarios', id_tabla=user.id)
                    
                    flash('User updated successfully', 'success')
                    return redirect(url_for('users.index'))
            else:
                print("Entro al create user")
                passw = generate_password_hash(form.contrasenia.data, method='scrypt')
                passw_binary = passw.encode('utf-8')
                user = Users(usuario = form.usuario.data, 
                            correo = form.correo.data, 
                            contrasenia = passw_binary,
                            rol_id = form.rol_id.data)
                print("Usuario creado")
                print(user)
                db.session.add(user)
                db.session.commit()
                password = PasswordsHistory(id_usuario=user.id, contrasenia=passw_binary)
                db.session.add(password)
                db.session.commit()
                create_log(id_usuario=current_user.id, accion='insert', tabla='usuarios', id_tabla=user.id)
                
                print("usuario guardado")
                flash('Usuario added successfully', 'success')
                return redirect(url_for('users.index'))
        else:
            print(form.errors)
            error_messages = []
            for field, errors in form.errors.items():
                for error in errors:
                    error_messages.append(f"{field}: {error}")
            flash('Error adding user: {}'.format(', '.join(error_messages)), 'danger')
            return redirect(url_for('users.index'))
    except Exception as e:
        print(e)
        flash('Error adding user: {}'.format(e), 'danger')
        return redirect(url_for('users.index'))

@users.route('/delete', methods=['POST'])
@admin_permission.require(http_exception=403)
@login_required
def delete():
    id = request.form.get('id')
    user = Users.query.filter_by(id = id).first()
    user.status = 0
    db.session.commit()
    
    flash('Usuario desactivado satisfactoriamente', 'success')
    return redirect(url_for('users.index'))

@users.route('/activate', methods=['POST'])
@admin_permission.require(http_exception=403)
@login_required
def activate():
    id = request.form.get('id')
    user = Users.query.filter_by(id = id).first()
    user.status = 1
    db.session.commit()
    
    flash('Usuario reactivado', 'success')
    return redirect(url_for('suppliers.index'))