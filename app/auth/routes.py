from flask import render_template,current_app, redirect, url_for, request, flash
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from . import auth
from app.models.models import Users, Logs, db
from app.utils.utils import create_log, udate_loggin_attempts
from .forms import LoginForm
from flask_principal import identity_changed, Identity, AnonymousIdentity

@auth.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        
        if form.username.data.find('@') != -1:
            user = Users.query.filter_by(correo=form.username.data, status=1).first()
        else:
            user = Users.query.filter_by(usuario=form.username.data, status=1).first()

        hashed_password = user.contrasenia.decode('utf-8')
        print(hashed_password)
      
        if user and check_password_hash(hashed_password, form.password.data):
            login_user(user)
            # Tell Flask-Principal the identity changed
            identity_changed.send(current_app._get_current_object(),
                                  identity=Identity(user.id))

            create_log(id_usuario=user.id, accion='login', tabla='users', id_tabla=user.id)
            udate_loggin_attempts(user.id, 'success')
            return redirect(url_for('main.index'))
        else:
            create_log(id_usuario=user.id, accion='login_attempt', tabla='users', id_tabla=user.id)
            udate_loggin_attempts(user.id, 'fail')
            flash('Por favor revisa tus credenciales e intenta de nuevo.', 'danger')        
    return render_template('auth/login.html', form=form)

@auth.route('/logout')
@login_required
def logout():
    create_log(id_usuario=current_user.id, accion='logout', tabla='users', id_tabla=current_user.id)
    logout_user()
    return redirect(url_for('auth.login'))