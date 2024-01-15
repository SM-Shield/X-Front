// TweetDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TweetDetails = () => {
    const { tweetId } = useParams();
    const [tweet, setTweet] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/tweetInfos/${tweetId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setTweet(data)
            })
            .catch(error => console.error('Erreur de chargement du tweet', error));
    }, [tweetId]);

    if (!tweet) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <h1>{tweet.authorFullname} (@{tweet.authorUsername})</h1>
            <p>{tweet.content}</p>

            <div>
                <span>Likes: {tweet.likes}</span>
                {/* Liste déroulante des utilisateurs qui ont aimé le tweet */}
                <ul>
                    {tweet.likedBy.map(user => (
                        <li key={user}>{user}</li>
                    ))}
                </ul>
            </div>

            <div>
                <span>Retweets: {tweet.retweetsCount}</span>
                {/* Liste déroulante des retweets */}
                <ul>
                    {tweet.retweets.map(retweet => (
                        <li key={retweet.retweetId}>{retweet.retweetAuthorUsername}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Commentaires</h2>
                {/* Liste complète des commentaires */}
                {tweet.comments.map(comment => (
                    <div key={comment.commentId}>
                        <span>@{comment.commentAuthorUsername}</span>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TweetDetails;
