from wtforms import Form, StringField, FloatField, IntegerField, validators, DateField

class productionForm(Form):
    id = IntegerField('id', [validators.DataRequired(message="El campo es requerido")])
    id_receta = IntegerField("id_receta", [validators.DataRequired(message="El campo es requerido")])
    
class update_productionForm(Form):
    id = IntegerField('id', [validators.DataRequired(message="El campo es requerido")])
    stratus = IntegerField('stratus', [validators.DataRequired(message="El campo es requerido")])

class updateRequestForm(Form):
    id = IntegerField('id', [validators.DataRequired(message="El campo es requerido")])
    status = IntegerField('status', [validators.DataRequired(message="El campo es requerido")])
    