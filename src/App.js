import './App.css';
import { useState, useEffect } from 'react';
import Insults from './insultes.json';
import { useNavigate } from 'react-router-dom';

function App() {
  const [tweets, setTweets] = useState([]);
  const [searchValue, setSearchValue] = useState(''); 
  const [highlightBadWords, setHighlightBadWords] = useState(false);
  const navigate = useNavigate();

  const toggleComments = (tweetId) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.tweetId === tweetId ? { ...tweet, showComments: !tweet.showComments } : tweet
      )
    );
  };

  useEffect(() => {
    fetch('https://api-x-weld.vercel.app/api/tweet/getAll')
      .then(response => response.json())
      .then(data => {
        const updatedTweets = data.reverse().map(tweet => ({ ...tweet, showComments: false }));
        setTweets(updatedTweets);
      })
      .catch(error => console.error('Erreur de chargement des tweets', error));
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);

    const filtered = tweets.filter((tweet) =>
      tweet.content.toLowerCase().includes(inputValue.toLowerCase())
    );

    setTweets(filtered);
  };

  const hasInsults = (text) => {
    const insults = Insults.map(insult => insult.toLowerCase());
    return insults.some(insult => text.toLowerCase().includes(insult));
  };

  return (
    <div className="app-container">
      <div className="bar-container">
        <div className="bar-content">
          <img className="logo" alt="smshield Logo" src="./logo_blue.png" />
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
              <div key={tweet.tweetId} className="tweet" >
                <span className="tweet-name">{tweet.authorFullname}</span>
                <span className="tweet-username">@{tweet.authorName}</span>
                <p className={highlightBadWords && hasInsults(tweet.content) ? 'tweet-message highlight' : 'tweet-message'}>{tweet.content}</p>
                <div className="tweet-actions">
                  <span className="tweet-likes">❤️ {tweet.likes}</span>
                  <span className="tweet-retweets">🔁 {tweet.retweetsCount}</span>
                  <div>
                    <button onClick={() => toggleComments(tweet.tweetId)}>
                      {tweet.showComments ? "Masquer les commentaires" : "Afficher les commentaires"}
                    </button>
                  </div>
                </div>
                {tweet.showComments && (
                  <div className="tweet-comments">
                    {tweet.comments.map((comment, index) => (
                      <div key={index} className={`comment ${highlightBadWords && hasInsults(comment.content) ? 'highlight' : ''}`}>
                        @{comment.commentAuthorUsername}: {comment.content}
                      </div>
                    ))}
                  </div>
                )}
                  <div>
                    <button onClick={() => navigate(`/tweet/${tweet.tweetId}`)}>
                      {"Plus"}
                    </button>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
