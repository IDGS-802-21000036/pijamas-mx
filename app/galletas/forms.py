from wtforms import Form, StringField, FloatField, IntegerField, validators

def no_caracteres_especiales(form, field):
    if not field.data:
        return
    if not field.data.isalnum() and ' ' not in field.data:
        raise validators.ValidationError("El campo no debe contener caracteres especiales")

class galletaForm(Form):
    id = IntegerField('id')
    nombre_galleta = StringField("Nombre de la galleta", [
        validators.DataRequired(message="El campo es requerido"),
        validators.Length(min=1, max=80, message="Ingresa un nombre valido"),
        no_caracteres_especiales
    ])
    precio_unitario = FloatField("Precio unitario de la galleta", [
        validators.DataRequired(message="El campo es requerido"),
        validators.NumberRange(min=.1)

        ])
    precio_kilo = FloatField("Precio por kilo", [
        validators.DataRequired(message="El campo es requerido"),
        validators.NumberRange(min=.1)
        ])
    descripcion = StringField("Descripcion de la receta", [
        validators.DataRequired(message="El campo es requerido"),
        no_caracteres_especiales
        ])
    peso_galleta = FloatField("Peso unitario de la galleta", [
        validators.DataRequired(message="El campo es requerido"),
        validators.NumberRange(min=.1)

    ])
