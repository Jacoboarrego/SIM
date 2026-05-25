SIM - Release v1.0.0

Fecha: 2026-05-25

Resumen:
- Primer release público del sistema de inventarios.
- Incluye backend (Express + MongoDB), frontend (React + Vite), autenticación JWT, IA básica integrada a través de un servicio proxy.

Notas importantes:
- No subir nunca `backend/.env` al repositorio. Añadido a .gitignore.
- Rotar cualquier API key que haya sido expuesta accidentalmente.

Instrucciones rápidas:
- Backend: `cd backend && npm install && npm run dev` (por defecto en http://localhost:5000)
- Frontend: `cd frontend && npm install && npm run dev` (por defecto en http://localhost:5173)

Contacto del autor:
- Jacobo Arrego <jacobod-arregocesa@unilibre.edu.co>
