from flask import Blueprint

galletas = Blueprint('galletas',__name__)

from . import routes
