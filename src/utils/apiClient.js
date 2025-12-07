// Configuración de la API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Función para hacer peticiones con autenticación
// Si el token expira, lo refresca automáticamente
export async function fetchWithAuth(url, options = {}) {
  // Obtener token actual
  let token = localStorage.getItem("token");
  
  // Preparar headers con autenticación
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // Primera petición
  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  
  // Si obtenemos 401 (no autorizado), intentar refrescar el token
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (refreshToken) {
      try {
        // Intentar refrescar el token
        const refreshResponse = await fetch(`${API_URL}/api/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          
          // Guardar nuevo token
          localStorage.setItem("token", data.access);
          if (data.refresh) {
            localStorage.setItem("refreshToken", data.refresh);
          }
          
          // Reintentar la petición original con el nuevo token
          headers.Authorization = `Bearer ${data.access}`;
          response = await fetch(`${API_URL}${url}`, {
            ...options,
            headers,
          });
        } else {
          // Si el refresh falla, limpiar todo
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      } catch (error) {
        console.error("Error al refrescar token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    }
  }
  
  return response;
}

// Peticiones GET
export async function apiGet(url) {
  const response = await fetchWithAuth(url);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Peticiones POST
export async function apiPost(url, data) {
  const response = await fetchWithAuth(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

// Peticiones PUT
export async function apiPut(url, data) {
  const response = await fetchWithAuth(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

// Peticiones PATCH
export async function apiPatch(url, data) {
  const response = await fetchWithAuth(url, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || `Error ${response.status}`);
  }
  return response.json();
}

// Peticiones DELETE
export async function apiDelete(url) {
  const response = await fetchWithAuth(url, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || `Error ${response.status}`);
  }
  // DELETE puede no devolver contenido
  if (response.status === 204) {
    return { success: true };
  }
  return response.json();
}
