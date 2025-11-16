// Cliente API con manejo automático de refresh token
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Función helper para hacer peticiones autenticadas con manejo automático de token refresh
 * @param {string} url - URL del endpoint (sin el dominio base)
 * @param {object} options - Opciones de fetch
 * @returns {Promise<Response>}
 */
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

/**
 * Helper para hacer peticiones GET autenticadas
 */
export async function apiGet(url) {
  const response = await fetchWithAuth(url);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Helper para hacer peticiones POST autenticadas
 */
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

/**
 * Helper para hacer peticiones PUT autenticadas
 */
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

/**
 * Helper para hacer peticiones PATCH autenticadas
 */
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

/**
 * Helper para hacer peticiones DELETE autenticadas
 */
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
