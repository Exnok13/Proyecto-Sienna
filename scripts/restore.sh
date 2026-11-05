#!/bin/bash

if [ -z "$1" ]; then
  echo "Uso: ./restore.sh <archivo_de_respaldo.sql>"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: El archivo $BACKUP_FILE no existe."
  exit 1
fi

echo "Restaurando base de datos desde $BACKUP_FILE..."

# Ejecutar psql dentro del contenedor para restaurar
cat "$BACKUP_FILE" | docker compose exec -T database psql -U sienna_user pedro_sienna_db

if [ $? -eq 0 ]; then
  echo "Restauración exitosa."
else
  echo "Error durante la restauración."
fi
