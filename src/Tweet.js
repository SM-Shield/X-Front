import './App.css';
import { useState, useEffect } from 'react';
import Tweets from './tweets.json';
import Insults from './insultes.json'; // Importez la liste d'insultes

function App() {
  const initialTweets = Tweets.map((tweet) => ({ ...tweet, showComments: false }));
  const [tweets, setTweets] = useState(initialTweets);
  const [searchValue, setSearchValue] = useState(''); // État pour la valeur de l'input
  const [highlightBadWords, setHighlightBadWords] = useState(false); // État pour activer/désactiver la surbrillance

  const toggleComments = (tweetId) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.id === tweetId ? { ...tweet, showComments: !tweet.showComments } : tweet
      )
    );
  };

  useEffect(() => {
    // Remplacez le chemin vers votre fichier JSON
    fetch('./tweets.json')
      .then(response => response.json())
      .then(data => setTweets(data))
      .catch(error => console.error('Erreur de chargement des tweets', error));
  }, []);

  // Gestionnaire d'événements onChange pour l'input
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);

    // Filtrer les tweets en fonction de la valeur de l'input
    const filtered = initialTweets.filter((tweet) =>
      tweet.message.toLowerCase().includes(inputValue.toLowerCase())
    );

    setTweets(filtered);
  };

  // Fonction pour vérifier si un texte contient des insultes
  const hasInsults = (text) => {
    const insults = Insults.map(insult => insult.toLowerCase());
    return insults.some(insult => text.toLowerCase().includes(insult));
  };

  return (
    <div className="app-container">
      <div className="bar-container">
        <div className="bar-content">
          <img className="logo" src="./logo_blue.png" />
          <div className="bar-title">- X API</div>

        </div>
      </div>
      <div className="body-container">
        <div className='big-card'>
          <div className="card-header">Listing Tweets</div>
          <div className="input-container">
            <button onClick={() => setHighlightBadWords(!highlightBadWords)}>
              {highlightBadWords ? "Désactiver detection" : "Activer detection"}
            </button>
            <input
              type="text"
              placeholder="Rechercher par message"
              value={searchValue}
              onChange={handleInputChange}
            />
          </div>
          <div className="tweet-list">
            {tweets.map(tweet => (
              <div key={tweet.id} className="tweet">
                <span className="tweet-name">{tweet.name}</span>
                <span className="tweet-username">@{tweet.username}</span>
                <p className={highlightBadWords && hasInsults(tweet.message) ? 'tweet-message highlight' : 'tweet-message'}>{tweet.message}</p>
                <div className="tweet-actions">
                  <span className="tweet-likes">❤️ {tweet.likes}</span>
                  <span className="tweet-retweets">🔁 {tweet.retweets}</span>
                  <button onClick={() => toggleComments(tweet.id)}>
                    {tweet.showComments ? "Masquer les commentaires" : "Afficher les commentaires"}
                  </button>
                </div>
                {tweet.showComments && (
                  <div className="tweet-comments">
                    {tweet.comments.map((comment, index) => (
                      <div key={index} className={`comment ${highlightBadWords && hasInsults(comment.message) ? 'highlight' : ''}`}>
                        @{comment.name}: {comment.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
