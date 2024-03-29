import React, { useState, useEffect } from 'react';
import './post.css';
import Insults from '../../insultes.json';

function Post() {
    const [tweet, setTweet] = useState('');
    const [tweets, setTweets] = useState([]);
    const [highlightInsults, setHighlightInsults] = useState(false);
    const [actualUserId] = useState(localStorage.getItem('actualUserId') || "656cf7b61068bdaf57421e21");
    const [actualUsername] = useState(localStorage.getItem('actualUsername') || "Matho");

    const handleTweetChange = (e) => {
        setTweet(e.target.value);
    };

    const handlePublish = () => {
        if (tweet.trim() !== '') {
            setTweets([{ content: tweet, username: actualUsername, likedBy: [], retweets: [], comments: [] }, ...tweets]);
            
            publishTweet(tweet);
            
            setTweet('');
        }
    };

    const toggleHighlightInsults = () => {
        setHighlightInsults(!highlightInsults);
    };

    useEffect(() => {
        fetch(`https://api-x-weld.vercel.app/api/tweet/${actualUserId}`)
            .then(response => response.json())
            .then(data => {
                setTweets(data.reverse());
                console.log('Tweets chargés avec succès :', data);
            })
            .catch(error => console.error('Erreur de chargement des tweets', error));
    }, [actualUserId]);

    const publishTweet = (content) => {
        fetch('https://api-x-weld.vercel.app/api/tweet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content,
                authorID: actualUserId,
                username: actualUsername
            }),
        })
        .then(response => response.json())
        .then(data => console.log('Tweet publié avec succès :', data))
        .catch(error => console.error('Erreur lors de la publication du tweet', error));
    };

    return (
        <div className="app-container">
            <div className="bar-container">
                <div className="bar-content">
                    <img className="logo" alt="smshield_logo" src="./logo_blue.png" />
                    <div className="bar-title">- X API</div>
                </div>
            </div>
            <div className="body-container">
                <h1>Post a tweet</h1>
                <div>
                    <textarea
                        rows="4"
                        cols="50"
                        placeholder="Exprimez-vous..."
                        value={tweet}
                        onChange={handleTweetChange}
                    />
                    <br />
                    <button onClick={handlePublish}>Publier</button>
                </div>
                <div>
                    <h2>Timeline</h2>
                    <button onClick={toggleHighlightInsults}>
                        {highlightInsults ? "Désactiver surbrillance des insultes" : "Activer surbrillance des insultes"}
                    </button>
                    {tweets.map((t, index) => (
                        <div key={index} className="tweet">
                            <div>
                                <b>{t.username}</b>
                                <div className={highlightInsults && hasInsults(t.content) ? 'highlight' : ''}>
                                    {t.content}
                                </div>
                            </div>
                            <div className="tweet-actions">
                                <span className="tweet-likes">❤️ {t.likedBy.length}</span>
                                <span className="tweet-retweets">🔁 {t.retweets.length}</span>
                            </div>
                            {t.comments.length > 0 && (
                                <div className="tweet-comments">
                                    {t.comments.map((comment, cIndex) => (
                                        <div key={cIndex} className="comment">
                                            <b>{comment.username}</b>: {comment.content}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Post;

function hasInsults(text) {
    const insults = Insults.map(insult => insult.toLowerCase());
    return insults.some(insult => text.toLowerCase().includes(insult));
}
