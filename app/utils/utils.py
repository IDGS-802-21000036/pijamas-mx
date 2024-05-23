from app.models.models import Logs, LoginAttemts, db, Users, PasswordsHistory

def create_log(id_usuario, accion, tabla, id_tabla):
    log = Logs(id_usuario=id_usuario, accion=accion, tabla=tabla, id_tabla=id_tabla)
    db.session.add(log)
    db.session.commit()
      
def udate_loggin_attempts(id_usuario, action):
    user = LoginAttemts.query.filter_by(id_usuario=id_usuario).first()
    if action == 'success':
        if user:
            LoginAttemts.query.filter_by(id_usuario=id_usuario).update(dict(consecutive_fails=0))
            db.session.commit()
            return
        else:
            return
    if action == 'fail':
        
        if user:
            if user.consecutive_fails >= 3:
                Users.query.filter_by(id=id_usuario).update(dict(status=0))
                db.session.commit()
                return
            else:
                LoginAttemts.query.filter_by(id_usuario=id_usuario).update(dict(consecutive_fails=user.consecutive_fails+1)) 
                db.session.commit()  
                return
        else:
            user = LoginAttemts(id_usuario=id_usuario, consecutive_fails=1)
            db.session.add(user)
            db.session.commit()
        db.session.commit()
    return 