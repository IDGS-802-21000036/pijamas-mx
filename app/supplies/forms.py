from wtforms import Form, StringField, IntegerField, validators

def no_caracteres_especiales(form, field):
    if not field.data:
        return
    if not field.data.isalnum() and ' ' not in field.data:
        raise validators.ValidationError("El campo no debe contener caracteres especiales")


class SuppliesForm(Form):
    id = IntegerField("id")
    nombre = StringField("nombre", render_kw={"placeholder": "Nombre"},
                         validators=[validators.DataRequired(message='El campo es requerido'), validators.length(min=4, max=200, message="Ingrese un nombre válido"),
                                     no_caracteres_especiales])
    
    descripcion = StringField("descripcion", render_kw={"placeholder": "Descripción"}, 
                              validators=[validators.DataRequired(message='El campo es requerido'), validators.length(min=4, max=200, message="Ingrese una descripción válida"),
                                          no_caracteres_especiales])
    
    min_stock = IntegerField("min_stock", render_kw={"placeholder": "Stock mínimo"}, 
        validators=[validators.DataRequired(message='El campo es requerido')])
    
    max_stock = IntegerField("max_stock", render_kw={"placeholder": "Stock máximo"},
                             validators=[validators.DataRequired(message='El campo es requerido')])
    
    unidad_medida = StringField("unidad_medida", render_kw={"placeholder": "Unidad de medida"},
                                validators=[validators.DataRequired(message='El campo es requerido')])
    
    