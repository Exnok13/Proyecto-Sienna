#!/bin/bash

# Directorio para guardar los backups
BACKUP_DIR="./scripts/backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_sienna_$TIMESTAMP.sql"

echo "Iniciando respaldo de la base de datos..."

# Ejecutar pg_dump dentro del contenedor
# Asume que tu docker-compose.yml está en un directorio superior
docker compose exec -T database pg_dump -U sienna_user pedro_sienna_db > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "Respaldo exitoso: $BACKUP_FILE"
else
  echo "Error al realizar el respaldo."
fi
