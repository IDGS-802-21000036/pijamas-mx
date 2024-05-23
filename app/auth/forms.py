from wtforms import StringField, PasswordField, validators
from flask_wtf import FlaskForm

class LoginForm(FlaskForm):
    username = StringField('Usuario', [validators.InputRequired()])
    password = PasswordField('Contraseña', [validators.InputRequired()])