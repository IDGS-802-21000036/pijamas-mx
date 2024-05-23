from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey,Float,DateTime
from sqlalchemy.orm import relationship

import datetime
from datetime import timedelta

db = SQLAlchemy()

class Roles(db.Model):
    __tablename__ = 'roles'
    id = Column(Integer, primary_key=True, autoincrement=True)
    rol = Column(String(100))
    descripcion = Column(String(255))
    acceso = Column(Integer, default=0)
    aniadir = Column(Integer, default=0)
    eliminar = Column(Integer, default=0)
    modificar = Column(Integer, default=0)
    usuarios = db.relationship('Users', backref='rol', lazy=True)

class Users(db.Model):
    __tablename__ = 'usuarios'
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario = Column(String(80))
    correo = Column(String(120))
    contrasenia = Column(db.LargeBinary)
    rol_id = Column(Integer, ForeignKey('roles.id'))
    status = Column(Integer, default=1)
    
    @property
    def is_active(self):
        return self.status == 1
    
    @property
    def is_authenticated(self):
        return True
    
    def get_id(self):
        return str(self.id)
    
class Logs(db.Model):
    __tablename__ = 'logs'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.Integer, ForeignKey('usuarios.id'), nullable=False)
    accion = db.Column(db.String(100), nullable=False)
    fecha_accion = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    tabla = db.Column(db.String(80))
    id_tabla = db.Column(db.String(80))

    def __init__(self, id_usuario, accion, tabla, id_tabla):
        self.id_usuario = id_usuario
        self.accion = accion
        self.tabla = tabla
        self.id_tabla = id_tabla

class Suppliers(db.Model):
    __tablename__ = 'proveedores'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100))
    rfc = Column(String(100))
    correo = Column(String(255))
    telefono = Column(String(20))
    status = Column(Integer, default=1)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'rfc': self.rfc,
            'correo': self.correo,
            'telefono': self.telefono
        }

class Supplies(db.Model):
    __tablename__ = 'materias_primas'

    id = db.Column(Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(String(100))
    descripcion = db.Column(String(255))
    min_stock = db.Column(Float)
    max_stock = db.Column(Float)
    stock = db.Column(Float)
    unidad_medida = db.Column(String(2))

    def __init__(self, nombre, descripcion, min_stock, max_stock, stock, unidad_medida):
        self.nombre = nombre
        self.descripcion = descripcion
        self.min_stock = min_stock
        self.max_stock = max_stock
        self.stock = stock
        self.unidad_medida = unidad_medida
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'min_stock': self.min_stock,
            'max_stock': self.max_stock,
            'stock': self.stock,
            'unidad_medida': self.unidad_medida
        }
        
    def convert_to(self, unit, quantity):
        if self.unidad_medida == unit:
            return quantity
        if self.unidad_medida == 'kg' and unit == 'g':
            return quantity/1000
        if self.unidad_medida == 'g' and unit == 'kg':
            return quantity*1000
        if self.unidad_medida == 'kg' and unit == 'mg':
            return quantity/1000000
        if self.unidad_medida == 'g' and unit == 'mg':
            return quantity/1000
        if self.unidad_medida == 'mg' and unit == 'g':
            return quantity*1000
        if self.unidad_medida == 'mg' and unit == 'kg':
            return quantity*1000000
        if self.unidad_medida == 'L' and unit == 'ml':
            return quantity/1000
        if self.unidad_medida == 'ml' and unit == 'L':
            return quantity/1000
        if self.unidad_medida == 'L' and unit == 'u':
            return quantity/1000
        if self.unidad_medida == 'ml' and unit == 'u':
            return quantity
        if self.unidad_medida == 'u' and unit == 'ml':
            return quantity
        if self.unidad_medida == 'u' and unit == 'L':
            return quantity*1000
        if self.unidad_medida == 'un' and unit == 'kg':
            return quantity/1000
        
        
class SupplyDetails(db.Model):
    __tablename__ = 'detalles_materias_primas'

    id_proveedor = db.Column(Integer, db.ForeignKey('proveedores.id'), primary_key=True)
    id_materia_prima = db.Column(Integer, db.ForeignKey('materias_primas.id'), primary_key=True)

    supplier = db.relationship('Suppliers', backref=db.backref('supply_details', lazy=True))
    supply = db.relationship('Supplies', backref=db.backref('supply_details', lazy=True))

    def __init__(self, id_proveedor, id_materia_prima):
        self.id_proveedor = id_proveedor
        self.id_materia_prima = id_materia_prima
    
    def to_dict(self):
        return {
            'id_proveedor': self.id_proveedor,
            'id_materia_prima': self.id_materia_prima
        }
    
class Galletas(db.Model):
    __tablename__ = 'galletas'
    id=Column(Integer,primary_key=True)
    nombre_galleta = Column(String(120))
    precio_unitario=Column(Float(10))
    precio_kilo=Column(Float(10))
    descripcion=Column(String(120))
    peso_galleta=Column(Float(10))
    status = Column(Integer, default=1)

class Purchases(db.Model):
    __tablename__ = 'compras'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    id_proveedor = db.Column(db.Integer, db.ForeignKey('proveedores.id'), nullable=False)
    total = db.Column(db.Float, nullable=False)
    fecha = db.Column(db.DateTime, server_default=db.func.current_timestamp())

    user = db.relationship('Users', backref=db.backref('purchases', lazy=True))
    supplier = db.relationship('Suppliers', backref=db.backref('purchases', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'id_usuario': self.id_usuario,
            'id_proveedor': self.id_proveedor,
            'total': self.total,
            'fecha': self.fecha.strftime('%Y-%m-%d %H:%M:%S')
        }

class PurchaseDetails(db.Model):
    __tablename__ = 'detalles_compra'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_compra = db.Column(db.Integer, db.ForeignKey('compras.id'), nullable=False)
    id_materia_prima = db.Column(db.Integer, db.ForeignKey('materias_primas.id'), nullable=False)
    precio_lote = db.Column(db.Float, nullable=False)
    contenido_unidad = db.Column(db.Float, nullable=False)
    cantidad = db.Column(db.Float, nullable=False)
    unidad_medida = db.Column(db.String(3), nullable=False)

    purchase = db.relationship('Purchases', backref=db.backref('purchase_details', lazy=True))
    supply = db.relationship('Supplies', backref=db.backref('purchase_details', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'id_compra': self.id_compra,
            'id_materia_prima': self.id_materia_prima,
            'precio_lote': self.precio_lote,
            'contenido_unidad': self.contenido_unidad,
            'cantidad': self.cantidad,
            'unidad_medida': self.unidad_medida
        }
        
class Inventory(db.Model):
    __tablename__ = 'inventario'
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_materia_prima = Column(Integer, ForeignKey('materias_primas.id'))
    stock_inicial = Column(Float)
    stock = Column(Float)
    lote = Column(String(100), primary_key=True, unique=True, index=True)
    fecha_caducidad = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    fecha_compra = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    en_stock = Column(Integer, default=1)
    
    def to_dict(self):
        return {
            'id': self.id,
            'id_materia_prima': self.id_materia_prima,
            'stock': self.stock,
            'lote': self.lote,
            'fecha_caducidad': self.fecha_caducidad.strftime('%Y-%m-%d %H:%M:%S')
        }
    
class Recetas(db.Model):
    __tablename__ = 'recetas'
    id=Column(Integer,primary_key=True)
    nombre_receta = Column(String(120))
    descripcion = Column(String(120))
    cantidad_produccion=Column(Integer)
    id_galleta = Column(Integer, ForeignKey('galletas.id'))  # Definición de la clave externa
    galleta = relationship("Galletas")  # Relación con la tabla Galletas
    status = Column(Integer, default=1)
    
class Production(db.Model):
    __tablename__ = 'produccion'
    id=Column(Integer,primary_key=True)
    cantidad_producida = Column(Integer)
    fecha_produccion = Column(db.DateTime, server_default=db.func.current_timestamp())
    id_receta = Column(Integer, ForeignKey('recetas.id'))  # Definición de la clave externa
    receta = relationship("Recetas")  # Relación con la tabla Recetas
    status = Column(Integer, default=1)
    
class Detalles_receta(db.Model):
    __tablename__ = 'detalle_receta'
    id=Column(Integer,primary_key=True)
    id_receta = Column(Integer, ForeignKey('recetas.id'))  # Definición de la clave externa
    id_materia_prima = Column(Integer, ForeignKey('materias_primas.id'))  # Definición de la clave externa
    cantidad=Column(Integer)
    
class Mermas(db.Model):
    __tablename__ = 'mermas'
    id=Column(Integer,primary_key=True)
    id_materia_prima = Column(Integer, ForeignKey('materias_primas.id'))  # Definición de la clave externa
    lote = Column(String(100), ForeignKey('inventario.lote')) 
    cantidad=Column(Integer)
    comentario=Column(String(255))
    unidad_medida = Column(String(2))
    fecha = db.Column(db.DateTime, server_default=db.func.current_timestamp())

def calcular_fecha_caducidad():
    return datetime.now() + timedelta(days=15)

class Cookies_stock(db.Model):
    __tablename__ = 'inventario_galletas'
    id = db.Column(Integer, primary_key=True)
    id_produccion = Column(Integer, ForeignKey('produccion.id'))  # Definición de la clave externa
    production = relationship("Production")  # Relación con la tabla Production
    id_galleta = Column(Integer, ForeignKey('galletas.id'))  # Definición de la clave externa
    cookie = relationship("Galletas")  # Relación con la tabla Galletas
    stock = db.Column(Integer)
    lote = db.Column(String(100))
    fecha_caducidad = Column(db.DateTime, default=calcular_fecha_caducidad)
    
class Ventas(db.Model):
    __tablename__ = 'ventas'
    id=Column(Integer,primary_key=True)
    id_usuario = Column(Integer, ForeignKey('usuarios.id'))  # Definición de la clave externa
    total = Column(Float)
    fecha = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    
    
class Detalles_venta(db.Model):
    __tablename__ = 'detalles_venta'
    id=Column(Integer,primary_key=True)
    id_venta = Column(Integer, ForeignKey('ventas.id'))  # Definición de la clave externa
    id_galleta = Column(Integer, ForeignKey('galletas.id'))  # Definición de la clave externa
    presentacion = Column(String(120))  # Definición de la clave externa
    cantidad=Column(Float)
    precio=Column(Float)
    
class LoginAttemts(db.Model):
    __tablename__ = 'intentos_login'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.Integer, ForeignKey('usuarios.id'), nullable=False)
    user = db.relationship('Users')
    fecha = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    consecutive_fails = db.Column(db.Integer, default=0)
    
class PasswordsHistory(db.Model):
    tablename = 'historial_contrasenias'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.Integer, ForeignKey('usuarios.id'), nullable=False)
    user = db.relationship('Users')
    contrasenia = db.Column(db.LargeBinary)
    fecha = db.Column(db.DateTime, server_default=db.func.current_timestamp())

class ProductionRequest(db.Model):
    __tablename__ = 'solicitudes_produccion'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column(db.Integer, ForeignKey('usuarios.id'), nullable=False)
    user = db.relationship('Users')
    id_receta = db.Column(db.Integer, ForeignKey('recetas.id'), nullable=False)
    recipe = db.relationship('Recetas')
    fecha = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    status = db.Column(db.Integer, default=0)
    
    
    