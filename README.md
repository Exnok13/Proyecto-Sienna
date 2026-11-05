	Plataforma Premios Pedro Sienna (Unidad 2)

Sistema de votación, cartelera y análisis de reseñas impulsado por Inteligencia Artificial para los Premios Pedro Sienna, orquestado mediante 
arquitectura de microservicios con Docker.

## Equipo de Desarrollo

* **Luis Benavides Guerrero y Martin Fuentes

## Arquitectura y Tecnologias
El sistema está contenerizado y orquestado con `docker-compose`, segmentado en las siguientes capas:
* **Gateway (Nginx):** Enrutamiento de tráfico y balanceo de carga (Puerto 80).
* **Frontend (React/Vite):** Interfaz de usuario servida por Nginx no-root.
* **Backend (Node.js/Express):** API RESTful desplegada en Alta Disponibilidad (2 réplicas) en el puerto interno 4000.
* **Base de Datos (PostgreSQL):** Persistencia de datos con volúmenes persistentes y healthchecks activos.
* **Servicio de IA (Python/FastAPI):** Microservicio dedicado para el análisis de sentimiento y resumen de reseñas de películas. 

## Instrucción de Despliegue

##  Requisitos Previos
* Docker y Docker Compose instalados.
* Sistema operativo Linux (Ubuntu/Debian) para entorno de producción.

## Levantar la Infraestructura 
Ejecuta el siguiente comando para construir las imágenes y levantar los contenedores en segundo plano:

docker compose up -d --build

La aplicación estará disponible en http://34.0.55.168

## Seguridad 
Todos los contenedores de aplicacion que seria el frontend, backend, ia-service y el gateway trabajan sin privilegios para garantizar el principio de menor privilegio
Existen 2 contenedores que se les aplicaron permisos root, los cuales son Portainer, ya que necesita el acceso root para poder leer el archivo /var/run/docker.sock del
 host para poder administar los contenedores, el otro contenedor es la Base de datos, porque necesita inicar como root temporalmenete para configurar los permisos de las
carpetas de almacenamiento

## Alta Disponibilidad
La aplicacion del backend opera con 2 replicas y el gateway Nginx balancea el trafico entre ambas instancias.
Se puede detener un nodo del backend (docker stop <nombre-contenedor>) y verificar que el Nginx Gateway enruta automáticamente el tráfico al nodo sano sin interrumpir
el servicio.

## Recuperacion ante desastres

El sistema cuenta con scripts automatizados para asegurar la resiliencia de la base de datos PostgreSQL.

##Crear un respaldo
chmod +x scripts/backup.sh
./scripts/backup.sh
El archivo se guardará en scripts/backups/ con la marca de tiempo correspondiente.

##Restaurar respaldo
# 1. Listar los respaldos disponibles
ls -l scripts/backups/

# 2. Ejecutar el script indicando la ruta exacta del archivo a restaurar
chmod +x scripts/restore.sh
./scripts/restore.sh ./scripts/backups/backup_sienna_YYYY-MM-DD_HH-MM-SS.sql

## Gestion y Monitoreo

Se optó por Portainer en lugar de herramientas de observabilidad complejas por tres decisiones clave de diseño:
1. **Control Activo:** Permite interactuar en vivo con el clúster (apagar/encender réplicas del backend) para demostrar el funcionamiento real de la Alta 
Disponibilidad mediante una interfaz gráfica.
2. **Eficiencia de Recursos:** Es un contenedor ultraligero que no satura la memoria RAM del servidor en Google Cloud, manteniendo los costos bajos.
3. **Gestión Centralizada:** Facilita la revisión rápida del estado de los *healthchecks*, el aislamiento de las redes internas y la lectura de los logs de los 
microservicios sin depender exclusivamente de la consola.

## Inicialización Portainer 

Portainer se ejecuta de forma independiente a los microservicios del proyecto. Para instalarlo e inicializarlo en el servidor, ejecuta estos comandos en la terminal:

```bash
# 1. Crear el volumen persistente para Portainer
docker volume create portainer_data

# 2. Desplegar el contenedor exponiendo el puerto seguro 9443
docker run -d -p 8000:8000 -p 9443:9443 --name portainer \
    --restart=always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data \
    portainer/portainer-ce:latest

## Integración de IA

Se decidió hacer un apartado de reseñas de las cuales una IA hace un resumen para no tener que leer todas las reseñas cada una.
La IA seleccionada para procesar las peticiones es Gemini. 
En caso de que la solicitud falle hay una IA de respaldo que funcione de forma independiente solo analizando palabras clave y dando respuestas predefinidas.
La IA se ejecuta en el momento que el usuario entra a ver alguna película, en ese momento se realiza la cansulta a Gemini para que la procese y devuelva una respuesta mas detallada derivada de las reseñas. En el caso de que esta solicitud a Gemini falle se utiliza la IA de respaldo dando una respuesta más simple pero cumple con dar una respuesta hasta que vuelva el servicio de Gemini. 
## Como Utilizar

Acceso Web: Abre un navegador e ingresa a la dirección https://<IP_DEL_SERVIDOR>:9443

