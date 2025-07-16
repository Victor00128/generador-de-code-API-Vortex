# API Key Generator - Versión Mejorada

Un generador seguro de claves API con backend Flask y frontend React, implementando las mejores prácticas de seguridad.

## 🚀 Características

- **Generación segura de claves API** - Claves criptográficamente seguras generadas en el servidor
- **Interfaz moderna** - React con TypeScript y diseño responsivo
- **Backend robusto** - Flask con base de datos SQLite
- **Gestión completa** - Crear, listar, actualizar y eliminar claves
- **Límites configurables** - Control de número máximo de claves y expiración
- **Notificaciones en tiempo real** - Feedback inmediato para todas las acciones

## 🛡️ Mejoras de Seguridad

- ✅ Claves generadas con `secrets` module (criptográficamente seguras)
- ✅ Almacenamiento seguro en base de datos (no en localStorage)
- ✅ Validación del servidor para todos los límites y restricciones
- ✅ API RESTful con manejo robusto de errores
- ✅ CORS configurado para comunicación segura frontend-backend

## 📁 Estructura del Proyecto

```
├── api-key-backend/           # Backend Flask
│   ├── src/
│   │   ├── models/
│   │   │   └── api_key.py    # Modelo de base de datos
│   │   ├── routes/
│   │   │   └── api_keys.py   # Endpoints de la API
│   │   ├── static/           # Frontend construido
│   │   └── main.py          # Aplicación principal
│   └── requirements.txt
│
└── api-key-generator/        # Frontend React
    ├── services/
    │   └── apiService.ts     # Servicio de comunicación con API
    ├── components/           # Componentes React
    ├── App.tsx              # Componente principal
    └── vite.config.ts       # Configuración con proxy
```

## 🚀 Instalación y Uso

### Desarrollo

1. **Backend (Terminal 1)**
   ```bash
   cd api-key-backend
   source venv/bin/activate
   python src/main.py
   ```

2. **Frontend (Terminal 2)**
   ```bash
   cd api-key-generator
   npm install
   npm run dev
   ```

3. **Acceder a la aplicación**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

### Producción

1. **Construir frontend**
   ```bash
   cd api-key-generator
   npm run build
   cp -r dist/* ../api-key-backend/src/static/
   ```

2. **Ejecutar aplicación completa**
   ```bash
   cd api-key-backend
   source venv/bin/activate
   python src/main.py
   ```

3. **Acceder a la aplicación**
   - Aplicación completa: http://localhost:5000

## 🔧 API Endpoints

### Claves API
- `GET /api/keys` - Obtener todas las claves activas
- `POST /api/keys` - Generar nueva clave API
- `PUT /api/keys/{id}` - Actualizar nombre de clave
- `DELETE /api/keys/{id}` - Revocar clave API

### Configuración
- `GET /api/config` - Obtener configuración del sistema

## 🎯 Funcionalidades

### Generación de Claves
- Claves únicas con formato `ak_` + 32 caracteres aleatorios
- Límite configurable (por defecto: 2 claves activas)
- Expiración automática (por defecto: 15 días)

### Gestión de Claves
- Visualización de todas las claves activas
- Edición de nombres de claves
- Copia al portapapeles con un clic
- Revocación segura de claves

### Interfaz de Usuario
- Diseño responsivo para móvil, tablet y escritorio
- Notificaciones en tiempo real
- Indicadores de expiración
- Animaciones y transiciones suaves

## 🔒 Consideraciones de Seguridad

- Las claves API nunca se almacenan en el frontend
- Generación criptográficamente segura usando `secrets` module
- Validación del servidor para todos los límites
- Base de datos SQLite para persistencia segura
- CORS configurado apropiadamente

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 19 con TypeScript
- Vite para desarrollo y construcción
- CSS moderno con Tailwind-like classes

### Backend
- Flask (Python)
- SQLAlchemy para ORM
- SQLite para base de datos
- Flask-CORS para comunicación cross-origin

## 📝 Configuración

Las constantes principales se pueden modificar en:
- `api-key-backend/src/routes/api_keys.py`:
  - `MAX_KEYS` - Número máximo de claves activas
  - `EXPIRATION_DAYS` - Días de validez de las claves

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Reconocimientos

- Proyecto original mejorado con implementación de mejores prácticas de seguridad
- Interfaz de usuario preservada para mantener la experiencia familiar
- Arquitectura escalable para futuras mejoras

