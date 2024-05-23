from flask import Blueprint

suppliers = Blueprint('suppliers', __name__)

from . import routes