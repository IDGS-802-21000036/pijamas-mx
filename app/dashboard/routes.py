from flask import render_template
from flask_login import login_required
from . import dashboard
from app.models.models import db, Ventas,Detalles_venta,Galletas
from sqlalchemy import func


@dashboard.route('/', methods=['GET', 'POST'])
@login_required
def index():
    ventasDia = db.session.query(func.date(Ventas.fecha).label('fecha'), func.count().label('ventas_dia')).group_by(func.date(Ventas.fecha)).all()
    galletasVendidas = db.session.query(Galletas.nombre_galleta, func.sum(Detalles_venta.cantidad).label('total_vendido')).join(Detalles_venta, Detalles_venta.id_galleta == Galletas.id).group_by(Galletas.nombre_galleta).all()

    ventasDia_serializable = [{'fecha': venta.fecha, 'ventas_dia': venta.ventas_dia} for venta in ventasDia]
    galletaVendida_serializable = [{'cantidad': galleta.total_vendido, 'nombre_galleta': galleta.nombre_galleta} for galleta in galletasVendidas]
    
    print(ventasDia_serializable)   
    print(galletaVendida_serializable)

    return render_template("dashboard/dashboard.html", ventasDia=ventasDia_serializable, galletaVendida=galletaVendida_serializable)
