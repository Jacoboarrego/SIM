# SIM - Sistema de Inventarios con IA

Proyecto full stack basado en React + Express + MongoDB.

## Estructura del proyecto

- `backend/`: servidor Express, rutas API, controladores y modelos.
- `frontend/`: aplicación React con Vite, páginas, componentes y estilos.
- `.gitignore`: archivos ignorados.
- `README.md`: instrucciones de ejecución.

## Carpetas del proyecto

```
inventory-system/
  backend/
    controllers/
    middleware/
    models/
    routes/
    package.json
    server.js
    .env.example
  frontend/
    src/
      components/
      contexts/
      data/
      pages/
      services/
      App.jsx
      main.jsx
      index.css
      App.css
    package.json
    vite.config.js
    index.html
  .gitignore
  README.md
```

## Requisitos previos

1. Node.js instalado.
2. MongoDB corriendo localmente en `mongodb://127.0.0.1:27017`.

## Cómo ejecutar el backend

1. Abrir terminal y ubicarte en `inventory-system/backend`.
2. Ejecutar:

```bash
npm install
```

3. Copiar `backend/.env.example` a `backend/.env` y configurar si es necesario.
4. Iniciar el servidor:

```bash
npm run dev
```

El backend se ejecutará en `http://localhost:5000`.

## Cómo ejecutar el frontend

1. Abrir otra terminal y ubicarte en `inventory-system/frontend`.
2. Ejecutar:

```bash
npm install
npm run dev
```

3. Abrir el navegador en la URL que muestra Vite, normalmente `http://localhost:5173`.

## Qué incluye esta aplicación

- Login/registro de usuarios con JWT.
- Dashboard de inventario con CRUD completo de productos.
- Carrito de compras y pasarela de pago simulada.
- Formulario PQR.
- Slider de imágenes en la página inicial.
- Botones de accesibilidad (modo oscuro y ajuste de texto).
- Integración con redes sociales.
- Ubicación con Google Maps.
- API para guardar información de desarrolladores.
- Sistema básico de inteligencia artificial para recomendaciones y análisis.

## Nota para estudiantes

Este proyecto está listo para extenderse. Puedes mejorar la IA agregando un chat más avanzado, añadir validación adicional en el backend, o integrar una base de datos en la nube.

---

**Guía de despliegue rápida**

1. Crear variables en tu entorno para el backend (ejemplo `backend/.env`):

```
MONGO_URI=mongodb://127.0.0.1:27017/inventory
PORT=5000
JWT_SECRET=tu_jwt_secret
OPENROUTER_API_KEY=tu_openrouter_api_key
OPENROUTER_API_URL=https://openrouter.ai/api/v1
OPENROUTER_SITE_URL=http://localhost:5173
OPENROUTER_APP_NAME=SIM_Inventory_System
```

2. Instalar dependencias y arrancar:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (otra terminal)
cd frontend
npm install
npm run dev
```

3. Pruebas rápidas (desde otra terminal):

```bash
curl -i http://localhost:5000/api/health
curl -i -X POST http://localhost:5000/api/deepseek/chat -H "Content-Type: application/json" -d '{"prompt":"Dame recomendaciones de inventario"}'
```

---

**Contribuciones**

- Por favor abre issues en GitHub para bugs o mejoras.
- Incluye pruebas unitarias cuando agregues lógica crítica.

**Contacto**

- Jacobo Arrego <jacobod-arregocesa@unilibre.edu.co>
