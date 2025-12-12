import { useState, useEffect } from "react";
import './styles/App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {API, fetcher} from "./api/api";
import { message, Typography } from 'antd';
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";

const { Title } = Typography;

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // --- LOGIQUE DE VÉRIFICATION INITIALE ---
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // Tente d'appeler le nouveau point de terminaison /me
        const { data } = await API.get('/users/me'); 
        setUser(data); // Si réussi, l'utilisateur est connecté
      } catch (error) {
        // 401 non authentifié est normal si le cookie est absent ou expiré
        if (error.response && error.response.status === 401) {
          setUser(null);
        } else {
          console.error("Erreur lors de la vérification de session:", error);
          // Optionnel: Gérer les erreurs de réseau plus sévères
        }
      } finally {
        setLoadingInitial(false); // Le chargement est terminé quoi qu'il arrive
      }
    };
    checkUserSession();
  }, []); // [] signifie que cela s'exécute une seule fois au montage

  
  // --- Fonctions de connexion/déconnexion/enregistrement (avec redirection) ---
  
const onLogin = async (values) => { 
    // values contient déjà { username: '...', password: '...' } grâce à Login.jsx
    
    let payload = { 
        // 1. Utiliser values.username (ce qui vient du formulaire)
        username: values.username, 
        
        // 2. S'assurer que la clé JSON envoyée correspond au schéma UserLogin corrigé (username: str)
        password: values.password 
    };
    
    try {
        // Envoi du payload corrigé à l'API
        const { data } = await API.post('/users/login', payload);
        
        // Si la connexion réussit (statut 200/201)
        setUser(data.user);
        message.success(`Bienvenue, ${data.user.name} !`);
        navigate('/'); // <-- REDIRECTION VERS LA PAGE PRINCIPALE
    } catch (error) {
        // Le backend renvoie 401 si les identifiants sont incorrects
        console.error("Erreur lors du login:", error);
        
        // Si l'erreur est un 401 (Unauthorized), affichez un message plus précis
        if (error.response && error.response.status === 401) {
            message.error("Identifiant ou mot de passe incorrect.");
        } else {
            message.error("Une erreur s'est produite lors de la connexion.");
        }
    }
  };

  const onRegister = async values => {
    let payload = { name:values.username, email:values.email, password:values.password, role:values.role };
    try {
      const { data } = await API.post('/users', payload);
      message.success(`Compte créé pour ${data.name}. Veuillez vous connecter.`);
      return data;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      // L'erreur 409 (conflit, ex: email déjà utilisé) devrait être gérée ici.
      message.error("Erreur lors de l'inscription. (Email peut-être déjà utilisé).");
    }
  };

  const onLogout = async () => {
    try {
      await API.post('/users/logout');
      setUser(null);
      message.info("Déconnexion réussie.");
      navigate('/login'); // <-- REDIRECTION VERS LOGIN
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // --- Rendu conditionnel ---

  // Afficher un écran de chargement tant que la vérification initiale n'est pas faite
  if (loadingInitial) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#333' }}>
            <Title style={{color: 'white'}}>Chargement de la session...</Title>
            {/* Vous pouvez ajouter un spinner Ant Design ici : <Spin size="large" /> */}
        </div>
    );
  }

  // Une fois le chargement terminé, on rend les routes
  return (
      <Routes>
        {/* Route pour la page de connexion/enregistrement (publique) */}
        <Route path="/login" element={
          <Login 
            onLogin={onLogin} 
            onRegister={onRegister}
            user={user}
            onLogout={onLogout}
          />} 
        />
        
        {/* Route pour votre page principale (protégée) */}
        <Route path="/" element={
          user 
          ? <HomePage user={user} onLogout={onLogout} /> // Si connecté, affiche la page principale
          : <Login 
              onLogin={onLogin} 
              onRegister={onRegister}
              user={user}
              onLogout={onLogout}
            /> // Sinon, on affiche la page de connexion
        }/>
        
        {/* Redirection si l'utilisateur arrive sur la page principale sans être authentifié */}
        <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
      </Routes>
  );
}

export default App