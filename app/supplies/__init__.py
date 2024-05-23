from flask import Blueprint

supplies = Blueprint('supplies', __name__)

from . import routes