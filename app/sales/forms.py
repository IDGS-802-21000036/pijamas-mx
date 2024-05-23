from wtforms import Form, StringField, FloatField, IntegerField, validators, DateField

class salesForm(Form):
    id_galleta = IntegerField("id_galleta", [validators.DataRequired(message="El campo es requerido")])
    unidad = StringField("unidad", [validators.DataRequired(message="El campo es requerido")])
    cantidad = IntegerField("cantidad", [validators.DataRequired(message="El campo es requerido")])
    
class productionRequestForm(Form):
    id = IntegerField('id', [validators.DataRequired(message="El campo es requerido")])
    id_usuario = IntegerField("id_usuario", [validators.DataRequired(message="El campo es requerido")])
    id_receta = IntegerField('id_receta', [validators.DataRequired(message="El campo es requerido")])
 
class salesDelete(Form):
    id = IntegerField('id', [validators.DataRequired(message="El campo es requerido")])

class updateRequestForm(Form):
    id = IntegerField('id', [validators.DataRequired(message="El campo es requerido")])
    status = IntegerField('status', [validators.DataRequired(message="El campo es requerido")])
    