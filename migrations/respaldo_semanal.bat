@echo off
rem Credentials to connect to mysql server
set mysql_user=mario_backup
set mysql_password=mario_backup

rem Credentials to connect to local folder
set local_folder=C:\xampp\htdocs\sr_cookie\migrations

rem Nombre de la base de datos que deseas respaldar
set database_name=sir_cookie

rem backup file name generation
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set "datetime=%%I"
set "backup_name=%database_name%-%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%-%time::=%"

rem Crear el respaldo solo para la base de datos especificada
mysqldump --user=%mysql_user% --password=%mysql_password% %database_name% > "%local_folder%\%backup_name%.sql"
if %ERRORLEVEL% neq 0 (
    eventcreate /ID 1 /L APPLICATION /T ERROR /SO mysql-backup-script /D "Backup failed: error during dump creation"
    exit /b %ERRORLEVEL%
) else (
    eventcreate /ID 1 /L APPLICATION /T INFORMATION /SO mysql-backup-script /D "Backup successful"
)
