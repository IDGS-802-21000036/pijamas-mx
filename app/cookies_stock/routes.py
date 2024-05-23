from flask import render_template, request, flash, redirect, url_for
from flask_login import login_required
from .forms import cookie_stockForm
from . import cookies_stock
from app.models.models import db, Cookies_stock, Galletas, Production
from sqlalchemy import func

@cookies_stock.route('/', methods=['GET', 'POST'])
@login_required
def index():
    form = cookie_stockForm()
    cookies_stock = Cookies_stock.query.join(Galletas).join(Production).all()
    
    total_stock = db.session.query(
        Galletas.nombre_galleta,
        Galletas.precio_unitario,
        Galletas.precio_kilo,
        func.sum(Cookies_stock.stock).label('total_stock')
    ).join(Cookies_stock).group_by(Galletas.id).all()
    
    return render_template("cookies_stock/cookies_stock.html", cookies_stock=cookies_stock, form=form, total_stock=total_stock)

