# Cliente

Directorio de clientes creado con React, Vite y Supabase. Consulta `id` y `nombre` de `public.cliente`, busca y ordena los resultados y exporta el directorio a CSV.

## Empezar

1. Instala Node.js 20.19+ y ejecuta `npm install`.
2. Copia `.env.example` a `.env.local` y completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` desde Supabase.
3. Ejecuta `npm run dev`.
4. Inicia sesión con el enlace mágico enviado al correo autorizado del proyecto.

La clave publishable es apta para aplicaciones de navegador; nunca pongas una clave `service_role` en el frontend. La tabla conserva RLS: su política de lectura requiere una sesión autenticada y autoriza el correo configurado en Supabase.

Los archivos `.env.local` se excluyen de Git. Consulta `.env.example` para las variables necesarias.
