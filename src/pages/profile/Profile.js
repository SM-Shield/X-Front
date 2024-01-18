import React, { useState, useEffect } from 'react';
import './profile.css';

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const [followersList, setFollowersList] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [profileData, setProfileData] = useState({
        profilePic: './userProfile.jpg',
        username: '...',
        fullname: '...',
        bio: '...',
        followers: 0,
        following: 0,
    });
    const [actualUserId] = useState(localStorage.getItem('actualUserId') || "656cf7b61068bdaf57421e21");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    


    const handleBlockFollower = (index) => {
        handleBlock("follower", followersList, index);
    };
    
    const handleBlockFollowing = (index) => {
        handleBlock("following", followingList, index);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCloseModal = () => {
        setIsEditing(false);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://api-x-weld.vercel.app/api/users/${actualUserId}/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: profileData.username,
                    full_name: profileData.fullname,
                    bio: profileData.bio,
                    profile_picture: profileData.profilePic, 
                }),
            });
    
            if (response.ok) {
                const updatedProfileData = await response.json();
                setProfileData((prevProfileData) => ({
                    ...prevProfileData,
                    followers: updatedProfileData.followers,
                    following: updatedProfileData.following,
                }));
                console.log("Profil mis à jour avec succès!");
                localStorage.setItem("actualUsername", updatedProfileData.user.username);
            } else {
                console.error("Échec de la mise à jour du profil.");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil:", error);
        }
    
        setIsEditing(false);
    };
    


    const handleShowFollowers = () => {
        setShowFollowers(!showFollowers);
    };

    const handleShowFollowing = () => {
        setShowFollowing(!showFollowing);
    };

    const handleBlock = async (type, list, index) => {
        const searchedUserId = list[index].id;
        try {
            const response = await fetch(`https://api-x-weld.vercel.app/api/users/updateFollow`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: type === "following" ? actualUserId : searchedUserId,
                    targetId: type === "following" ? searchedUserId : actualUserId,
                    action: "remove"
                }),
            });
    
            if (response.ok) {
                console.log(`Utilisateur avec userId ${searchedUserId} bloqué avec succès!`);
    
                if (type === "follower") {
                    setFollowersList(prevList => prevList.filter(user => user.id !== searchedUserId));
                } else if (type === "following") {
                    setFollowingList(prevList => prevList.filter(user => user.id !== searchedUserId));
                }

                setProfileData(prevProfileData => ({
                    ...prevProfileData,
                    followers: type === "follower" ? prevProfileData.followers - 1 : prevProfileData.followers,
                    following: type === "following" ? prevProfileData.following - 1 : prevProfileData.following,
                }));
            } else {
                console.error(`Échec du blocage de l'utilisateur avec userId: ${searchedUserId}`);
            }
        } catch (error) {
            console.error("Erreur lors du blocage de l'utilisateur:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = actualUserId;

                // Fetch followers data
                const followersResponse = await fetch(`https://api-x-weld.vercel.app/api/users/${userId}/followers`);
                const followersData = await followersResponse.json();
                setFollowersList(followersData);

                // Fetch following data
                const followingResponse = await fetch(`https://api-x-weld.vercel.app/api/users/${userId}/followings`);
                const followingData = await followingResponse.json();
                setFollowingList(followingData);

                // Fetch profile data
                const profileResponse = await fetch(`https://api-x-weld.vercel.app/api/users/${userId}/profile`);
                const profileDataFromServer = await profileResponse.json();
                // console.log(profileDataFromServer);

                setProfileData({
                    ...profileDataFromServer,
                    followers: followersData.length,
                    following: followingData.length,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [actualUserId]);

    return (

        <div className="app-container">
            <div className="bar-container">
                <div className="bar-content">
                    <img className="logo" src="./logo_blue.png" alt="Logo" />
                    <div className="bar-title">- X API</div>
                </div>
            </div>
            <div className="body-container">
                <h2>Mon Profil</h2>
                <div className="profile-info">
                    <img className="profile-photo" src={profileData.profilePic} alt="Profil" />
                    <div>
                        <p className="username">
                            {profileData.username}
                        </p>
                        <p className="arobase">
                            {profileData.fullname}
                        </p>
                        <p>
                            {profileData.bio}
                        </p>
                    </div>
                    <div className="follow-info">
                        <p onClick={handleShowFollowers}>
                            <strong>{profileData.followers}</strong> Abonnés
                        </p>
                        {showFollowers && (
                            <div className="followers-list">
                                {followersList.map((follower, index) => (
                                    <p key={`follower-${index}`}>
                                        <b>{`${follower.username}  (${follower.id})`}</b>
                                        <button onClick={() => handleBlockFollower(index)}>Bloquer</button>
                                    </p>
                                ))}
                            </div>
                        )}
                        <p onClick={handleShowFollowing}>
                            <strong>{profileData.following}</strong> Abonnements
                        </p>
                        {showFollowing && (
                            <div className="following-list">
                                {followingList && followingList.map((following, index) => (
                                    <p key={`following-${index}`}>
                                        <b>{`${following.username}  (${following.id})`}</b>
                                        <button onClick={() => handleBlockFollowing(index)}>Bloquer</button>
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button onClick={handleEditClick}>Modifier le Profil</button>
            {isEditing && (
                <div className='modal-container'>
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>
                            &times;
                        </span>
                        <form onSubmit={handleSaveChanges} encType="multipart/form-data">
                            <label>
                                Photo de Profil (URL) :
                                <input
                                    type="text"
                                    name="profilePic"
                                    value={profileData.profilePic}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Nom d'Utilisateur:
                                <input
                                    type="text"
                                    name="username"
                                    value={profileData.username}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Full name:
                                <input
                                    type="text"
                                    name="fullname"
                                    value={profileData.fullname}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Bio:
                                <textarea
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <div className="modal-buttons">
                                <button type="button" onClick={handleCloseModal}>
                                    Annuler
                                </button>
                                <button type="submit">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
