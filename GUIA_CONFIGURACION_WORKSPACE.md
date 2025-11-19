# Guía: Clonar Proyectos de GitHub y Configurar Workspace en VS Code

Esta guía te explica cómo configurar un entorno de desarrollo completo desde cero en cualquier PC, clonando tus proyectos desde GitHub y trabajando con ellos en VS Code.

---

## 📋 Requisitos Previos

### 1. Instalar Git

**¿Qué es Git?** Es el sistema de control de versiones que te permite clonar repositorios, hacer commits y sincronizar cambios.

**Cómo instalarlo:**
1. Ve a https://git-scm.com/download/win
2. Descarga el instalador para Windows
3. Ejecuta el instalador (puedes dejar todas las opciones por defecto)
4. Reinicia VS Code después de la instalación

**Verificar que está instalado:**
```powershell
git --version
```
Debería mostrar algo como: `git version 2.51.2.windows.1`

### 2. Configurar Git (Primera vez en un PC nuevo)

Antes de hacer commits, Git necesita saber quién eres:

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

**Nota:** Usa el mismo email que tienes en tu cuenta de GitHub.

---

## 🚀 Método 1: Un Solo Proyecto (Lo Más Común)

### Paso 1: Crear una Carpeta para tus Proyectos

```powershell
# Navegar a donde quieras guardar tus proyectos
cd C:\Users\Usuario\Documents

# Crear una carpeta (opcional, pero recomendado)
mkdir mis-proyectos
cd mis-proyectos
```

### Paso 2: Clonar el Repositorio

```powershell
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
```

**Ejemplo real:**
```powershell
git clone https://github.com/jrodgom/ivdb.git
```

Esto creará una carpeta `ivdb` con todo el código del proyecto.

### Paso 3: Abrir el Proyecto en VS Code

**Opción A - Desde la terminal:**
```powershell
cd ivdb
code .
```

**Opción B - Desde VS Code:**
1. Abre VS Code
2. File → Open Folder
3. Selecciona la carpeta `ivdb`

### Paso 4: Instalar Dependencias

Si es un proyecto Node.js/React:
```powershell
npm install
```

Si es un proyecto Python:
```powershell
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
```

### Paso 5: Trabajar en el Proyecto

1. Haz los cambios que necesites en el código
2. Guarda los archivos

### Paso 6: Hacer Commit de tus Cambios

```powershell
# Ver qué archivos has modificado
git status

# Agregar todos los archivos modificados
git add .

# O agregar archivos específicos
git add src/components/MiComponente.jsx

# Crear un commit con un mensaje descriptivo
git commit -m "Descripción de lo que cambiaste"
```

### Paso 7: Subir los Cambios a GitHub

```powershell
git push
```

Si te pide usuario y contraseña, GitHub ya no acepta contraseñas. Necesitarás:
- Un **Personal Access Token** (ve a GitHub → Settings → Developer settings → Personal access tokens)
- O configurar **SSH keys**

### Paso 8: Sincronizar en Otro PC

Cuando vayas a tu PC de casa:

```powershell
cd ruta/al/proyecto
git pull
```

Esto descargará todos los cambios que hiciste en el otro PC.

---

## 🔥 Método 2: Multiple Proyectos en un Mismo Workspace (Frontend + Backend)

Este es el método que usamos para tener tanto el frontend como el backend juntos.

### Paso 1: Crear una Carpeta Contenedora

```powershell
# Crear carpeta para el workspace
cd C:\Users\Usuario\Downloads
mkdir ivdb-workspace
cd ivdb-workspace
```

### Paso 2: Clonar Ambos Repositorios

```powershell
# Clonar el frontend
git clone https://github.com/jrodgom/ivdb.git

# Clonar el backend
git clone https://github.com/jrodgom/backend-ivdb.git
```

Ahora tendrás esta estructura:
```
ivdb-workspace/
├── ivdb/              (tu frontend)
└── backend-ivdb/      (tu backend)
```

### Paso 3: Abrir Ambos Proyectos en VS Code

**Opción A - Desde la terminal (lo más rápido):**
```powershell
code ivdb backend-ivdb
```

**Opción B - Desde VS Code (manual):**
1. Abre VS Code
2. File → Open Folder → Selecciona `ivdb`
3. File → Add Folder to Workspace → Selecciona `backend-ivdb`
4. File → Save Workspace As → Guarda como `ivdb-workspace.code-workspace`

### Paso 4: Instalar Dependencias de Ambos Proyectos

**Para el Frontend:**
```powershell
cd ivdb
npm install
```

**Para el Backend:**
```powershell
cd ..\backend-ivdb
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
```

### Paso 5: Trabajar con Múltiples Proyectos

En VS Code verás ambas carpetas en el explorador. Puedes:
- Editar archivos de ambos proyectos
- Tener terminales separados para cada uno
- GitHub Copilot tendrá contexto de ambos proyectos

### Paso 6: Hacer Commits en Proyectos Separados

**Importante:** Cada repositorio tiene su propio Git. Los commits son independientes.

**Para hacer commit en el frontend:**
```powershell
cd C:\Users\Usuario\Downloads\ivdb-workspace\ivdb
git status
git add .
git commit -m "Actualizado componente X"
git push
```

**Para hacer commit en el backend:**
```powershell
cd C:\Users\Usuario\Downloads\ivdb-workspace\backend-ivdb
git status
git add .
git commit -m "Agregada nueva API endpoint"
git push
```

**Desde VS Code (más fácil):**
1. Abre la vista de Source Control (Ctrl+Shift+G)
2. Verás ambos repositorios listados por separado
3. Haz commits en cada uno independientemente

---

## 📝 Comandos Git Esenciales (Cheat Sheet)

```powershell
# Ver estado de tus cambios
git status

# Ver historial de commits
git log --oneline

# Agregar archivos al staging
git add archivo.js                 # Un archivo específico
git add src/                       # Una carpeta completa
git add .                          # Todos los archivos modificados

# Crear commit
git commit -m "Tu mensaje aquí"

# Subir cambios a GitHub
git push

# Descargar cambios de GitHub
git pull

# Ver qué cambios hiciste en un archivo
git diff archivo.js

# Descartar cambios en un archivo (¡cuidado!)
git checkout -- archivo.js

# Ver ramas disponibles
git branch

# Crear y cambiar a una nueva rama
git checkout -b nueva-funcionalidad

# Cambiar a otra rama
git checkout main

# Clonar un repositorio
git clone https://github.com/usuario/repo.git
```

---

## 🔧 Troubleshooting Común

### Git no se reconoce como comando
**Problema:** `El término 'git' no se reconoce como nombre de un cmdlet...`

**Solución:** 
1. Instala Git desde https://git-scm.com/download/win
2. Reinicia VS Code completamente
3. Abre un nuevo terminal en VS Code

### No puedo hacer push (pide contraseña)
**Problema:** GitHub rechaza tu contraseña

**Solución:**
1. Ve a GitHub.com → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Dale permisos de "repo"
5. Copia el token y úsalo como contraseña

### Conflictos al hacer pull
**Problema:** `CONFLICT: Merge conflict in archivo.js`

**Solución:**
1. Abre el archivo en VS Code
2. Verás marcadores `<<<<<<< HEAD` y `>>>>>>> branch`
3. Elige qué versión mantener
4. Elimina los marcadores
5. `git add archivo.js`
6. `git commit -m "Resuelto conflicto"`

---

## 💡 Buenas Prácticas

1. **Haz commits frecuentes** con mensajes descriptivos
   - ✅ Bueno: `"Agregado sistema de autenticación con JWT"`
   - ❌ Malo: `"cambios"` o `"fix"`

2. **Haz pull antes de empezar a trabajar**
   ```powershell
   git pull
   ```

3. **Haz push al terminar tu sesión**
   ```powershell
   git push
   ```

4. **No hagas commit de archivos sensibles**
   - Crea un archivo `.gitignore` para excluir:
     - `node_modules/`
     - `venv/`
     - `.env` (variables de entorno)
     - Archivos de configuración local

5. **Usa ramas para nuevas funcionalidades**
   ```powershell
   git checkout -b feature/nueva-funcionalidad
   # Trabaja en la funcionalidad
   git push -u origin feature/nueva-funcionalidad
   # Luego haz un Pull Request en GitHub
   ```

---

## 🎯 Resumen del Flujo de Trabajo Diario

```powershell
# 1. Obtener últimos cambios
git pull

# 2. Trabajar en tu código
# (editar archivos, probar, etc.)

# 3. Ver qué cambiaste
git status

# 4. Agregar cambios
git add .

# 5. Crear commit
git commit -m "Descripción de cambios"

# 6. Subir a GitHub
git push
```

---

## 📚 Recursos Adicionales

- **Git Documentation:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com/
- **VS Code Git Integration:** https://code.visualstudio.com/docs/sourcecontrol/overview
- **Configurar SSH en GitHub:** https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

**Última actualización:** 17 de noviembre de 2025
**Configuración realizada en:** `C:\Users\Usuario\Downloads\ivdb-workspace`
