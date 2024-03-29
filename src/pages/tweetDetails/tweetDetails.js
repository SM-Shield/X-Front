import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TweetDetails = () => {
    const { tweetId } = useParams();
    const defaultTweet = {
        authorFullname: "...",
        authorName: "...",
        comments: [],
        content: "...",
        likedBy: [],
        likes: 0,
        retweets: [],
        retweetsCount: 0,
    };
    const [tweet, setTweet] = useState(defaultTweet);

    useEffect(() => {
        fetch(`https://api-x-weld.vercel.app/api/tweetInfos/${tweetId}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Réponse non réussie');
                }
            })
            .then(data => {
                console.log(data);
                setTweet(data);
            })
            .catch(error => {
                console.error('Erreur de chargement du tweet', error);
                setTweet({
                    authorFullname: "...",
                    authorName: "...",
                    comments: [],
                    content: "...",
                    likedBy: [],
                    likes: 0,
                    retweets: [],
                    retweetsCount: 0,
                });
            });
    }, [tweetId]);    

    return (
        <div className="app-container">
            <div className="bar-container">
                <div className="bar-content">
                <img className="logo" alt="smshield Logo" src="../logo_blue.png" />
                <div className="bar-title">- X API</div>

                </div>
            </div>
            <div className="body-container margin">
                <div className="tweet">
                    <div className="tweet-header">
                        <span className="tweet-name">{tweet.authorFullname}</span>
                        <span className="tweet-username">@{tweet.authorName}</span>
                    </div>
                    <p className="tweet-message">{tweet.content}</p>
                    <div className="tweet-details">
                        <div className="tweet-likes">
                            ❤️ {tweet.likes}
                            <ul>
                                {tweet.likedBy.map(user => (
                                    <li key={user}>
                                        ({user})
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="tweet-retweets">
                            🔁 {tweet.retweetsCount}
                            <ul>
                                {tweet.retweets.map(retweet => (
                                    <li key={retweet.retweetId}>
                                        ({retweet.retweetAuthorId}) {retweet.retweetAuthorUsername}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="tweet-comments">
                        <h2>Commentaires</h2>
                        {tweet.comments.map(comment => (
                            <div key={comment.commentId} className="comment">
                                @{comment.commentAuthorUsername}: {comment.content}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetDetails;
