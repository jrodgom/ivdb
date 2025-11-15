# 🎮 Sistema de Búsqueda Global y Reseñas - IVDb

## 🚀 Nuevas Funcionalidades

### 1. **Búsqueda Global** 
- Busca entre **más de 800,000 juegos** usando la API de RAWG
- Barra de búsqueda con autocompletado en tiempo real
- Resultados con imágenes, ratings y información básica
- Navegación directa a la página de detalle del juego

### 2. **Sistema de Puntuación y Reseñas**
- **Puntuación obligatoria**: 1-10 estrellas
- **Reseña opcional**: Escribe tu opinión sobre el juego
- Solo usuarios autenticados pueden puntuar
- Los juegos se guardan automáticamente en tu BD local al puntuar

### 3. **Página de Detalle de Juego**
- Información completa del juego desde RAWG API
- Hero image con degradado
- Descripción detallada
- Información de desarrolladores, géneros, plataformas
- Capturas de pantalla
- Formulario de puntuación/reseña integrado

## 📋 Configuración

### 1. Obtener API Key de RAWG

1. Ve a [https://rawg.io/apidocs](https://rawg.io/apidocs)
2. Crea una cuenta gratuita
3. Obtén tu API key en el panel de usuario
4. El plan gratuito permite **20,000 requests al mes** (suficiente para búsquedas)

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` y agrega tu API key:

```env
VITE_RAWG_API_KEY=tu_api_key_aqui
VITE_API_URL=http://localhost:8000
```

### 3. Ejecutar el Backend

Asegúrate de que Django esté corriendo:

```bash
cd backend/ivdb
python manage.py runserver
```

### 4. Ejecutar el Frontend

```bash
cd frontend/ivdb
npm install  # Si es la primera vez
npm run dev
```

## 🎯 Cómo Usar

### Buscar Juegos

1. En la página principal, usa la barra de búsqueda
2. Escribe al menos 2 caracteres
3. Aparecerán resultados en tiempo real
4. Haz clic en cualquier juego para ver sus detalles

### Puntuar y Reseñar

1. Inicia sesión en tu cuenta
2. Busca y abre un juego
3. En la página de detalle, selecciona tu puntuación (1-10 estrellas)
4. Opcionalmente, escribe una reseña
5. Haz clic en "Enviar Reseña"
6. El juego se guardará automáticamente en tu BD

### Ver Juegos Destacados

- La página principal muestra **20 juegos destacados** de RAWG
- Carousel hero con los top 5 juegos
- Sección "Juegos Destacados" con los 20 mejores
- Sección "Tu Biblioteca" con tus juegos guardados

## 🛠️ Arquitectura

### Frontend

```
src/
├── services/
│   ├── rawgService.js      # Integración con RAWG API
│   ├── reviewService.js    # Sistema de reseñas
│   ├── gameService.js      # Juegos locales
│   └── authService.js      # Autenticación
├── components/
│   └── SearchBar.jsx       # Búsqueda global
└── pages/
    ├── Home.jsx            # Búsqueda + destacados
    └── GameDetail.jsx      # Detalle + puntuación
```

### Backend

```
backend/ivdb/
├── review/
│   ├── models.py           # Review(user, game, rating, comment)
│   └── api/
│       ├── views.py        # ReviewViewSet + user_review endpoint
│       ├── serializers.py  # ReviewSerializer
│       └── urls.py         # /review/reviews/
└── game/
    └── models.py           # Game model
```

## 📊 Flujo de Datos

### Búsqueda de Juegos
```
Usuario → SearchBar → rawgService.searchGames() → RAWG API → Resultados
```

### Puntuación de Juego
```
Usuario → GameDetail → reviewService.createReview() → 
  1. Crear/buscar juego en BD local
  2. Crear review asociada
  3. Guardar en backend
```

### Obtener Review Existente
```
GameDetail → reviewService.getUserReview(gameTitle) → 
  Backend busca Game por título → Busca Review del usuario → Retorna datos
```

## 🔧 Endpoints del Backend

### Reviews

- `GET /review/reviews/` - Lista todas las reseñas
- `GET /review/reviews/?game=<id>` - Reseñas de un juego específico
- `POST /review/reviews/` - Crear nueva reseña (requiere auth)
- `GET /review/reviews/user_review/?game_title=<title>` - Review del usuario actual
- `GET /review/reviews/average_rating/?game=<id>` - Rating promedio

### Games

- `GET /game/games/` - Lista todos los juegos locales
- `POST /game/games/` - Crear nuevo juego (usado automáticamente al puntuar)
- `GET /game/games/?search=<query>` - Buscar juegos locales

## 💡 Características Técnicas

### Optimizaciones

- **Debounce en búsqueda**: 300ms de espera antes de consultar API
- **Caché visual**: Las imágenes se cachean en el navegador
- **Lazy loading**: Los juegos destacados se cargan solo al montar Home
- **Prevención de duplicados**: El backend valida si el juego ya existe antes de crear

### Validaciones

- **Rating obligatorio**: No se puede enviar sin puntuación
- **Comment opcional**: El campo `comment` en Review tiene `blank=True`
- **Autenticación**: Solo usuarios autenticados pueden puntuar
- **Verificación de juego**: Se verifica que el juego exista antes de crear review

### UX

- **Loading states**: Indicadores de carga en búsqueda y envío
- **Error handling**: Mensajes de error claros
- **Overlay de búsqueda**: Clic fuera cierra los resultados
- **Formulario deshabilitado**: Si ya puntuaste, no puedes puntuar de nuevo
- **Rating visual**: Estrellas interactivas con hover effect

## 🐛 Troubleshooting

### La búsqueda no funciona

- Verifica que tengas tu API key en `.env`
- Revisa la consola del navegador para errores
- Asegúrate de que la API key sea válida en [RAWG](https://rawg.io)

### No puedo puntuar

- Asegúrate de haber iniciado sesión
- Verifica que Django esté corriendo en `localhost:8000`
- Revisa que el token JWT sea válido (en localStorage)

### Los juegos no se guardan

- Verifica que el modelo `Game` tenga todos los campos necesarios
- Revisa los logs de Django para errores
- Asegúrate de que el usuario tenga permisos de creación

## 📝 Próximas Mejoras

- [ ] Sistema de likes/helpful en reseñas
- [ ] Editar/eliminar reseñas propias
- [ ] Filtros avanzados en búsqueda (plataforma, año, género)
- [ ] Página de perfil con historial de reseñas
- [ ] Compartir juegos en redes sociales
- [ ] Sistema de listas personalizadas (Wishlist, Jugando, Completados)

## 🤝 Contribuciones

Este proyecto es de código abierto. Si encuentras bugs o tienes sugerencias, no dudes en abrir un issue o pull request.

## 📄 Licencia

MIT License - Úsalo como quieras 🚀
