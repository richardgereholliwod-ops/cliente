# appcliente

Aplicación web dinámica para consultar el directorio de `public.cliente` en Supabase. Presenta los campos `id` y `nombre`, con búsqueda, ordenamiento y exportación CSV.

## Empezar

1. Instala Node.js 22 o superior y pnpm 11.25.0.
2. Instala las dependencias con `pnpm install`.
3. Copia `.env.example` a `.env.local`.
4. Ejecuta `pnpm dev`.
5. Ingresa el correo autorizado y abre el enlace mágico que recibirás para iniciar sesión.

La conexión usa la clave publishable del proyecto y la tabla conserva Row Level Security. La política de lectura solo permite acceso autenticado a `richardgereholliwod@gmail.com`. No uses una clave `service_role` en el navegador. Los archivos `.env.local` están excluidos de Git.

## Despliegue

GitHub Actions construye y publica la app en GitHub Pages al actualizar `main`. En el repositorio, configura **Settings → Pages → Build and deployment → Source: GitHub Actions**. En Supabase, agrega `https://richardgereholliwod-ops.github.io/cliente/` a **Authentication → URL Configuration → Redirect URLs** para que el enlace mágico vuelva a la app publicada.
