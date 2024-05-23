from wtforms import Form, StringField, EmailField, validators, IntegerField
from wtforms.validators import Regexp
import re, os
from io import open 
from app.models.models import db, Users, PasswordsHistory
from werkzeug.security import check_password_hash, generate_password_hash


def no_caracteres_especiales(form, field):
    if not field.data:
        return
    if not field.data.isalnum() and ' ' not in field.data:
        raise validators.ValidationError("El campo no debe contener caracteres especiales")
    
def validar_historial_contrasenia(form, field):    
    if form.id.data == 0:
        return
    else:
        passwords_history = PasswordsHistory.query.filter_by(id_usuario=form.id.data).all()
        if not passwords_history:
            return
        else:
            for password in passwords_history:
                if check_password_hash(password.contrasenia.decode('utf-8'), field.data):
                    raise ValueError("La contraseña no puede ser igual a la anterior.")

def validar_contrasenia(form, field):
    # Verifica si contiene al menos una mayúscula
    if not re.search(r'[A-Z]', field.data):
        raise ValueError("La contraseña debe contener al menos una mayúscula.")

    # Verifica si contiene al menos una minúscula
    if not re.search(r'[a-z]', field.data):
        raise ValueError("La contraseña debe contener al menos una minúscula.")

    # Verifica si contiene al menos un número
    """ if not re.search(r'\d', field.data):
        raise ValueError("La contraseña debe contener al menos un número.") """

    # Verifica si contiene al menos un carácter especial
    if not re.search(r'[!@#$%^&*()_+{}[\]:;<>,.?~]', field.data):
        raise ValueError("La contraseña debe contener al menos un carácter especial.")

def validar_contrasenia_comun(form, field):
    directorio_actual = os.getcwd()

    # Lista los archivos y carpetas en el directorio actual
    contenido_directorio = os.listdir(directorio_actual)

    # Imprime los nombres de los archivos y carpetas
    for item in contenido_directorio:
        print(item)
    contrasenia = field.data
    with open('passwords.txt', 'r') as file:
        common_passwords = file.read().splitlines()
        if contrasenia in common_passwords:
            raise validators.ValidationError("No debe ser una contraseña común")
  
class UsersForm(Form):
    id = IntegerField("id")
    usuario= StringField("usuario",[
        validators.DataRequired(message='El campo es requerido'), 
        validators.length(min=4, max=20, message="Ingrese un nombre de usuario valido"),
        no_caracteres_especiales
        ])
    correo= EmailField("correo", [validators.length(min=6, max=100, message="Ingrese un correo valido")])
    contrasenia= StringField("contrasenia",[validators.DataRequired(message='El campo es requerido'), validar_contrasenia_comun, validar_contrasenia])
    rol_id= IntegerField("rol_id",[validators.DataRequired(message='El campo es requerido')])

