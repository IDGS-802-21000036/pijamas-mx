from wtforms import Form, StringField, EmailField, validators, IntegerField


def no_caracteres_especiales(form, field):
    if not field.data:
        return
    if not field.data.isalnum() and ' ' not in field.data:
        raise validators.ValidationError("El campo no debe contener caracteres especiales")


class SupplierForm(Form):
    id = IntegerField("id")
    nombre =StringField("nombre",[validators.DataRequired(message='El campo es requerido'), validators.length(min=4, max=20, message="Ingrese un nombre valido")])
    rfc = StringField("rfc",[validators.DataRequired(message='El campo es requerido'), validators.length(min=4, max=20, message="Ingrese un rfc valido")])
    correo = EmailField("correo", [validators.length(min=6, max=100, message="Ingrese un correo valido")])
    telefono = StringField("telefono",[validators.DataRequired(message='El campo es requerido'), validators.length(min=10, max=10, message="Ingrese un telefono valido"), validators.Regexp('^[0-9]*$', message="Ingrese un telefono valido")])
    no_caracteres_especiales

class SupplyDetailsForm(Form):
    supplies_ids = StringField("supplies_ids")
    supplier_id = IntegerField("supplier_id")
