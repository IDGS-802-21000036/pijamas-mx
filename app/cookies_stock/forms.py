from wtforms import Form, StringField, FloatField, IntegerField, validators

class cookie_stockForm(Form):
    id = IntegerField('id')
    id_produccion = IntegerField('id_produccion')
    id_galleta = IntegerField('id_galleta')
    stock = IntegerField('stock')
    lote = StringField('lote')
    fecha_caducidad = StringField('fecha_caducidad')