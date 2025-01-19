import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL: baseURL,
});

// Adicionar um interceptor para incluir o token no cabeçalho
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("enduranceToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Adicionar um interceptor de resposta para capturar o erro "No Token Valid"
api.interceptors.response.use(
  (response) => {
    // Se a resposta for bem sucedida, simplesmente a retorne
    return response;
  },
  (error) => {
    // Verifique se há uma resposta do servidor
    if (error.response) {
      // Verifique se a mensagem de erro é "No Token Valid"
      if (error.response.data.message === "Token invalid") {
        // Remova o token inválido do sessionStorage
        sessionStorage.removeItem("enduranceToken");
        window.location.href = "/login"; // Ou use o useNavigate se estiver no contexto de um componente
      }
    }
    // Retorne a Promise de rejeição com o erro para ser tratado onde for necessário
    return Promise.reject(error);
  }
);