import React, { useEffect, useState } from 'react';
import './search.css';

function Profile() {
    const [pseudoSearch, setPseudoSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [actualUserId] = useState(localStorage.getItem('actualUserId') || "656cf7b61068bdaf57421e21");

    const handleSubscribe = async (index) => {
        const updatedSubscriptions = [...subscriptions];
        updatedSubscriptions[index] = !updatedSubscriptions[index];
        setSubscriptions(updatedSubscriptions);

        const userId = searchResult[index].id;

        try {
            const response = await fetch(`https://api-x-weld.vercel.app/api/users/updateFollow`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: actualUserId,
                    targetId: searchResult[index].id,
                    action: "add"
                })
            });

            if (response.ok) {
                console.log(`Successfully subscribed to user with userId: ${userId}`);
            } else {
                console.error(`Failed to subscribe to user with userId: ${userId}`);
                updatedSubscriptions[index] = !updatedSubscriptions[index];
                setSubscriptions(updatedSubscriptions);
            }
        } catch (error) {
            console.error('Error making subscription request:', error);
        }
    };

    useEffect(() => {
        if (pseudoSearch === "") return;
        const fetchData = async () => {
            try {
                const response = await fetch("https://api-x-weld.vercel.app/api/search/userByName", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        pseudoSearch: pseudoSearch
                    })
                });
                const data = await response.json();
                console.log(data)

                if (Array.isArray(data)) {
                    setSearchResult(data);
                    setSubscriptions(new Array(data.length).fill(false));
                } else {
                    setSearchResult([]);
                    setSubscriptions([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [pseudoSearch]);

    return (
        <div className="app-container">
            <div className="bar-container">
                <div className="bar-content">
                    <img className="logo" src="./logo_blue.png" alt="Logo" />
                    <div className="bar-title">- X API</div>
                </div>
            </div>
            <div className="pseudo" htmlFor="pseudoSearch">Search User by username:</div>
            <div className="input-container">
                <input
                    type="text"
                    id="pseudoSearch"
                    placeholder='Search a user..'
                    value={pseudoSearch}
                    onChange={(e) => setPseudoSearch(e.target.value)}
                />
            </div>
            <div className="result-container">
                {searchResult.map((result, index) => (
                    <div key={index} className="profile-container">
                        <div className="left">
                            <img className="profilePic" src={result.profilePic} alt="Profile" />
                        </div>
                        <div className='flex'>
                            <div className="username">{result.username}</div>
                            <div className="name">{result.id}</div>
                            <div className="name">{result.name}</div>
                        </div>
                        <button
                            onClick={() => handleSubscribe(index)}
                            disabled={subscriptions[index]}
                        >
                            {subscriptions[index] ? 'Subscribed' : 'Subscribe'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Profile;
