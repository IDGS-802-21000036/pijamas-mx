from wtforms import Form, StringField, EmailField, validators, IntegerField, DateField, FloatField

class PurchaseForm(Form):
    proveedor_id = IntegerField("proveedor_id")
    fecha = StringField("fecha",[validators.DataRequired(message='El campo es requerido')])
    total = FloatField("total",[validators.DataRequired(message='El campo es requerido')])
    detalles = StringField("detalles")