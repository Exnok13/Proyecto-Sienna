#!/usr/bin/env bash
BACKUP_DIR="/var/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="pedro_sienna_db"
USER="sienna_user"

mkdir -p "$BACKUP_DIR"

PGPASSWORD='dbAdmin123' pg_dump -h 127.0.0.1 -U "$USER" -F c "$DB_NAME" > "$BACKUP_DIR/backup_${DB_NAME}_${DATE}.dump"

if [ $? -eq 0 ]; then
    echo "Backup exitoso: $DATE"
    find "$BACKUP_DIR" -name "backup_*.dump" -mtime +7 -delete
else
    echo "Error en backup: $DATE"
    exit 1
fi
