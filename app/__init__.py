from flask import Flask
from config import DevelopmentConfig
from .main import main as main_bp
from .auth import auth as auth_bp
from .galletas import galletas as cookie_bp
from .recetas import recetas as recetas_bp
from .dashboard import dashboard as dashboard_bp
from .suppliers import suppliers as suppliers_bp
from .supplies import supplies as supplies_bp
from .purchases import purchases as purchases_bp
from .users import users as users_bp
from .inventory import inventory as inventory_bp
from .production import production as production_bp
from .cookies_stock import cookies_stock as cookies_stock_bp
from .sales import sales as sales_bp
from app.models.models import db, Users
from flask_login import LoginManager
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_principal import Principal
from flask_principal import identity_loaded, RoleNeed, UserNeed, Identity
from flask_login import current_user
from flask import current_app



def create_app():
    app=Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    
    # Configuración de la aplicación
    principals = Principal(app)
    # Configura Flask-Login
    login_manager = LoginManager(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Por favor inicia sesión para acceder a esta página'

    @login_manager.user_loader
    def load_user(user_id):
        return Users.query.get(int(user_id))
    
    
    @identity_loaded.connect_via(app)
    def on_identity_loaded(sender, identity):
        # Set the identity user object
        identity.user = current_user

        # Add the UserNeed to the identity
        if hasattr(current_user, 'id'):
            identity.provides.add(UserNeed(current_user.id))

        # Assuming the User model has a role, update the identity
        # with the roles that the user provides
        if hasattr(current_user, 'rol'):
            identity.provides.add(RoleNeed(current_user.rol.rol))

    # Registrar blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(cookie_bp, url_prefix='/galletas')
    app.register_blueprint(recetas_bp, url_prefix='/recetas')
    app.register_blueprint(suppliers_bp, url_prefix='/suppliers')
    app.register_blueprint(supplies_bp, url_prefix='/supplies')
    app.register_blueprint(production_bp, url_prefix='/production')
    app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
    app.register_blueprint(purchases_bp, url_prefix='/purchases')
    app.register_blueprint(inventory_bp, url_prefix='/inventory')
    app.register_blueprint(users_bp, url_prefix='/users')
    app.register_blueprint(cookies_stock_bp, url_prefix='/cookies_stock')
    app.register_blueprint(sales_bp, url_prefix='/sales')

    return app
