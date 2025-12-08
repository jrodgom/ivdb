# Documentación TFG - IVDb

## 📁 Estructura de Archivos

Esta carpeta contiene toda la documentación del Trabajo de Fin de Grado (TFG) para el proyecto IVDb.

### Documentos Principales del Proyecto

1. **Proyecto_IVDb.html** (Parte 1)
   - Introducción al dominio
   - Glosario de términos (13 términos)
   - 8 Historias de Usuario (HU-01 a HU-08)
   - 7 Reglas de Negocio (RN-001 a RN-007)

2. **Proyecto_IVDb_Parte2.html** (Parte 2)
   - Entorno Tecnológico completo (Backend + Frontend + Base de Datos)
   - Arquitectura del sistema con diagramas ASCII
   - Descripción de capas (Presentación, Lógica, Persistencia)
   - Medidas de seguridad y escalabilidad

3. **Proyecto_IVDb_Parte3.html** (Parte 3)
   - 4 Subsistemas del proyecto (SS-001 a SS-004)
   - Diagrama de Casos de Uso (ASCII art)
   - 4 Actores del sistema (ACT-01 a ACT-04)
   - 8 Casos de Uso detallados (CU-01 a CU-08)

4. **Proyecto_IVDb_Parte4.html** (Parte 4)
   - Diagrama Entidad-Relación (ASCII art)
   - 5 Modelos de datos detallados (User, Profile, Game, Review, Favorite)
   - 3 Matrices de trazabilidad (HU → Requisitos → CU → Modelos)

5. **Proyecto_IVDb_Parte5.html** (Parte 5)
   - Definición completa de la Interfaz de Usuario
   - Principios de diseño y paleta de colores
   - Mapa de navegación (ASCII art)
   - 7 pantallas principales documentadas
   - Catálogo de 10 componentes reutilizables
   - Flujos de navegación típicos
   - Especificación responsive (móvil/tablet/escritorio)

### Manuales

6. **Manual_Usuario.html** ✅ CREADO
   - Manual completo para usuarios finales
   - Guía paso a paso de todas las funcionalidades
   - Búsqueda, favoritos, reseñas, perfil
   - Funciones de administrador
   - Preguntas frecuentes (FAQ)
   - 10 secciones completas

7. **Manual_Instalacion.html** ✅ CREADO
   - Requisitos del sistema (hardware y software)
   - Instalación paso a paso del Backend (Django)
   - Instalación paso a paso del Frontend (React + Vite)
   - Configuración de base de datos (SQLite y PostgreSQL)
   - Configuración API RAWG
   - Despliegue en desarrollo y producción
   - Solución de 15+ problemas comunes
   - Listas de verificación completas

### Carpeta de Imágenes

8. **images/** (carpeta vacía)
   - Preparada para capturas de pantalla
   - Diagramas adicionales
   - Logos e iconos

---

## 📋 Estado de la Documentación

### ✅ Completado

- [x] Parte 1: Introducción y Requisitos
- [x] Parte 2: Tecnología y Arquitectura  
- [x] Parte 3: Casos de Uso
- [x] Parte 4: Modelos de Datos y Trazabilidad
- [x] Parte 5: Interfaz de Usuario
- [x] Manual de Usuario
- [x] Manual de Instalación y Configuración

### ⚠️ Pendiente

- [ ] Combinar las 5 partes en un único documento HTML (opcional)
- [ ] Añadir capturas de pantalla reales en carpeta `images/`
- [ ] Añadir sección de Conclusiones al documento principal
- [ ] Añadir Bibliografía/Referencias
- [ ] Manual de Administrador (opcional según rúbricas)

---

## 🎯 Cómo Usar Esta Documentación

### Para Entregar el TFG:

1. **Opción A - Archivos Separados:**
   - Entrega las 5 partes del proyecto por separado
   - Entrega los 2 manuales por separado
   - Incluye este README.md como índice

2. **Opción B - Documento Único:**
   - Combina las 5 partes en un solo `Proyecto_IVDb_Completo.html`
   - Mantén los manuales separados
   - Añade portada, índice general, conclusiones y bibliografía

### Para Presentación:

- Todos los archivos HTML se pueden abrir directamente en cualquier navegador
- Los estilos están embebidos (no requieren archivos CSS externos)
- Los diagramas ASCII se visualizan correctamente en formato monoespaciado
- Las tablas están completamente formateadas

### Para Impresión:

- Los archivos HTML tienen configuración de `page-break-before` para saltos de página
- Las secciones principales comienzan en nueva página
- El estilo está optimizado para impresión (fuente serif, márgenes adecuados)

---

## 📊 Contenido por Rúbrica

### Análisis de Requisitos (Partes 1-3):
- ✅ Historias de Usuario completas con tablas estructuradas
- ✅ Reglas de negocio con dependencias
- ✅ Casos de uso detallados con flujos normales y excepcionales
- ✅ Actores y subsistemas identificados
- ✅ Diagramas de casos de uso

### Diseño (Partes 2, 4, 5):
- ✅ Arquitectura del sistema en capas
- ✅ Modelos de datos con todos los atributos
- ✅ Diagrama Entidad-Relación
- ✅ Definición completa de interfaz de usuario
- ✅ Especificación de componentes reutilizables
- ✅ Flujos de navegación

### Manuales:
- ✅ Manual de Usuario con 10 secciones
- ✅ Manual de Instalación con guía paso a paso
- ⚠️ Manual de Administrador (opcional, puede extraerse del Manual de Usuario sección 8)

### Matrices de Trazabilidad (Parte 4):
- ✅ HU → Requisitos Funcionales
- ✅ Requisitos → Casos de Uso
- ✅ Modelos → Requisitos

---

## 🔧 Tecnologías Documentadas

### Backend:
- Python 3.10+
- Django 5.2.7
- Django REST Framework 3.15.2
- Simple JWT 5.4.1
- SQLite / PostgreSQL

### Frontend:
- React 18.3.1
- Vite 6.0.5
- React Router DOM 7.1.1
- Axios 1.7.9
- TailwindCSS 3.4.17
- React Icons 5.4.0

### APIs Externas:
- RAWG API (key: 3994c5d1391e4fc8b4e7eca9428d8a8b)

---

## 📅 Información del Proyecto

- **Nombre:** IVDb - Base de Datos Interactiva de Videojuegos
- **Autor:** Jesús Rodríguez Gómez
- **Versión:** 1.0
- **Fecha:** 07/12/2025
- **Plazo de entrega:** Viernes 12/12/2025

---

## 📖 Formato de Documentos

Todos los documentos HTML siguen el formato académico estándar con:

- **Portada:** Título, nombre del proyecto, versión, fecha, autor
- **Índice:** Enlaces navegables a todas las secciones
- **Contenido:** Secciones numeradas con H1 (#980000) y H2 (#b45f06)
- **Tablas:** Bordes negros, encabezados rojos
- **Código:** Fuente monoespaciada con fondo oscuro
- **Notas/Advertencias:** Cajas coloreadas para destacar información importante

---

## 🎨 Paleta de Colores del Proyecto

| Color | Hex | Uso |
|-------|-----|-----|
| Rojo | #980000 | Títulos H1 |
| Naranja | #b45f06 | Títulos H2 |
| Gris Oscuro | #1f2937 | Fondos navbar/footer |
| Azul | #3b82f6 | Botones primarios, enlaces |
| Verde | #10b981 | Mensajes de éxito |
| Rojo Error | #ef4444 | Mensajes de error |
| Amarillo | #f59e0b | Advertencias, estrellas rating |
| Blanco | #ffffff | Fondos de tarjetas |

---

## 🚀 Próximos Pasos Recomendados

1. **Revisar contenido:** Lee cada archivo HTML en el navegador
2. **Añadir imágenes:** Captura pantallas de la aplicación y guárdalas en `images/`
3. **Referencias a imágenes:** Actualiza los archivos HTML para incluir las rutas a las imágenes
4. **Conclusiones:** Añade una sección final con resultados y conclusiones del proyecto
5. **Bibliografía:** Lista todas las fuentes consultadas (documentación Django, React, etc.)
6. **Revisión final:** Verifica ortografía, formato y coherencia

---

## 📞 Contacto

Para dudas o sugerencias sobre esta documentación:
- **GitHub Backend:** github.com/jrodgom/backend-ivdb
- **GitHub Frontend:** github.com/jrodgom/ivdb

---

**Última actualización:** 07/12/2025 23:30