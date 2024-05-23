# permissions.py
from flask_principal import Permission, RoleNeed

admin_permission = Permission(RoleNeed('ADMINISTRADOR'))
finanzas_permission = Permission(RoleNeed('FINANZAS'))
ventas_permission = Permission(RoleNeed('VENTAS'))
compras_permission = Permission(RoleNeed('COMPRAS'))
produccion_permission = Permission(RoleNeed('PRODUCCION'))

def multi_role_permission(*roles):
    needs = [RoleNeed(role) for role in roles]
    return Permission(*needs)

suppliers_permissions = multi_role_permission('ADMINISTRADOR', 'COMPRAS', 'FINANZAS')
purchases_permissions = multi_role_permission('ADMINISTRADOR', 'COMPRAS', 'FINANZAS')
production_permissions = multi_role_permission('ADMINISTRADOR', 'PRODUCCION')