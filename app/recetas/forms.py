

from wtforms import Form, StringField, FloatField, IntegerField, validators

def no_caracteres_especiales(form, field):
    if not field.data:
        return
    if not field.data.isalnum() and ' ' not in field.data:
        raise validators.ValidationError("El campo no debe contener caracteres especiales")

class recetaForm(Form):
    id = IntegerField('id')
    nombre_receta = StringField("Nombre de la rectea", [
        validators.DataRequired(message="El campo es requerido"),
        validators.Length(min=1, message="Ingresa un nombre valido"),
        no_caracteres_especiales
    ])
    descripcion = StringField("Descripcion de la receta", [
        validators.DataRequired(message="El campo es requerido"),
        validators.Length(min=1, message="Ingresa un nombre valido"),
        no_caracteres_especiales
    ])
    galleta = IntegerField("ID de la Galleta", [
        validators.DataRequired(message="El campo es requerido"),
        validators.NumberRange(min=1)
    ])
    cantidad_produccion = IntegerField("Cantidad de galletas por Reeceta", [
        validators.DataRequired(message="El campo es requerido"),
        validators.NumberRange(min=1)
    ])
