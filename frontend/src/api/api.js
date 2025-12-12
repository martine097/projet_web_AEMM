import axios from 'axios';

// La variable d'environnement VITE_API_BASE_URL est définie dans compose.yml
export const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers : {
        'X-Requested-With' : 'XMLHttpRequest',
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
    }
});

// fetcher est une fonction simple pour SWR, utilisée pour les requêtes GET
export const fetcher = url => API.get(url).then(res => res.data);

export default {API, fetcher};