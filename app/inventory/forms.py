from wtforms import Form, StringField, EmailField, validators, IntegerField

class SupplyInventoryForm(Form):
    supply_id = IntegerField("supply_id")
    
class MermaForm(Form):
    fecha = StringField("fecha", render_kw={"placeholder": "Fecha"}, validators=[validators.DataRequired(message='El campo es requerido')])
    unidad_medida = StringField("unidad_medida", render_kw={"placeholder": "Unidad de Medida"}, validators=[validators.DataRequired(message='El campo es requerido')])
    id_materia_prima = IntegerField("id_materia_prima")
    cantidad = IntegerField("cantidad", render_kw={"placeholder": "Cantidad"}, validators=[validators.DataRequired(message='El campo es requerido')])
    comentario = StringField("descripcion", render_kw={"placeholder": "Descripción"}, validators=[validators.DataRequired(message='El campo es requerido')])
    lote = StringField("lote", render_kw={"placeholder": "Lote"}, validators=[validators.DataRequired(message='El campo es requerido')])