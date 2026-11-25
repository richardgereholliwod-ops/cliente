# appcliente

Aplicación web dinámica para consultar el directorio de `public.cliente` en Supabase. Presenta los campos `id` y `nombre`, con búsqueda, ordenamiento y exportación CSV.

## Empezar

1. Instala Node.js 20.19+.
2. Instala las dependencias con `npm install`.
3. Copia `.env.example` a `.env.local`.
4. Ejecuta `npm run dev`.
5. Ingresa el correo autorizado y abre el enlace mágico que recibirás para iniciar sesión.

La conexión usa la clave publishable del proyecto y la tabla conserva Row Level Security. La política de lectura solo permite acceso autenticado a `richardgereholliwod@gmail.com`. No uses una clave `service_role` en el navegador. Los archivos `.env.local` están excluidos de Git.
