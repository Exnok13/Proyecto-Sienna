# Usar un tag específico
FROM nginx:1.25.3-alpine

# Eliminar configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiar nuestra configuración
COPY nginx.conf /etc/nginx/conf.d/

# Cambiar permisos para ejecutar como usuario no-root (nginx)
RUN chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 777 /var/cache/nginx /var/run /var/log/nginx

# Cambiar al usuario no-root
USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
