import React, { useState } from 'react';
import './settings.css';

function UserSettings() {
  const [userId, setUserId] = useState(localStorage.getItem('actualUserId'));
  const [successNotification, setSuccessNotification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem('actualUserId', userId);

    if (userId == null || userId === "") {
      localStorage.setItem('actualUserId', '');
      localStorage.setItem('actualUsername', '');
      return;
    }

    try {
      const response = await fetch(`https://api-x-weld.vercel.app/api/users/${userId}/profile`);
      const userData = await response.json();

      if (userData.username === undefined) {
        console.log("userId invalide");
        localStorage.setItem('actualUserId', '');
        localStorage.setItem('actualUsername', '');
        return;
      }

      localStorage.setItem('actualUsername', userData.username);
      setSuccessNotification(true);

      // Réinitialiser la notification après quelques secondes
      setTimeout(() => {
        setSuccessNotification(false);
      }, 3000); // Changez la durée de l'affichage de la notification selon vos besoins
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur', error);
      localStorage.setItem('actualUserId', '');
      localStorage.setItem('actualUsername', '');
    }
  };

  return (
    <div className="app-container">
      <div className="bar-container">
        <div className="bar-content">
          <img className="logo" alt="Logo" src="./logo_blue.png" />
          <div className="bar-title">- X API</div>
        </div>
      </div>
      <div className="body-container">
        <h1>Paramètres utilisateur</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="settings-container">
              <input
                type="text"
                placeholder="Nouvel ID utilisateur"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <div className="button-container">
                <button type="submit">Mettre à jour</button>
              </div>
            </div>
          </form>
          {successNotification && (
            <div className="notification">
              Changement de compte avec succès!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSettings;
