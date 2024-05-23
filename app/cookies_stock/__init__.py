from flask import Blueprint

cookies_stock = Blueprint('cookies_stock',__name__)

from . import routes
