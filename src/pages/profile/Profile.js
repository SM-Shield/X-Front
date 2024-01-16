import React, { useState, useEffect } from 'react';
import './profile.css';

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const [followersList, setFollowersList] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [profileData, setProfileData] = useState({
        profilePic: './profile.png',
        username: 'Matho',
        fullname: '@Mathobinks',
        bio: 'Explorateur passionné de la vie, naviguant entre pixels et aventures réelles, tout en cherchant la beauté dans chaque coin du monde.',
        followers: 0,
        following: 0,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    


    const handleBlockFollower = (index) => {
        handleBlock(followersList, index);
    };
    
    const handleBlockFollowing = (index) => {
        handleBlock(followingList, index);
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
            const response = await fetch(`https://api-x-weld.vercel.app/api/users/656cf7b61068bdaf57421e21/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    // Ajoutez d'autres en-têtes nécessaires, par exemple, le jeton d'authentification
                },
                body: JSON.stringify({
                    username: profileData.username,
                    full_name: profileData.fullname,
                    bio: profileData.bio,
                    profile_picture: profileData.profilePic,  // Utilisez la valeur actuelle de l'URL
                    // Ajoutez d'autres champs que vous souhaitez mettre à jour
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

    const handleBlock = async (list, index) => {
        // Obtenir le userId correspondant à l'index
        const userId = list[index].id;
    
        try {
            // Faire une requête PATCH pour bloquer l'utilisateur
            const response = await fetch(`http://localhost:8080/api/users/${userId}/followings`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: "MathoBaBinks",
                    _id : "656cf7b61068bdaf57421e21",
                    action: "remove"
                    // Ajoutez d'autres champs que vous souhaitez mettre à jour
                }),
            });
    
            // Handle the response as needed
            if (response.ok) {
                console.log(`Utilisateur avec userId ${userId} bloqué avec succès!`);
    
                // Mettez à jour la liste des followers ou followings après avoir bloqué l'utilisateur
                const updatedList = handleBlock(list, index);
                if (list === followersList) {
                    setFollowersList(updatedList);
                } else if (list === followingList) {
                    setFollowingList(updatedList);
                }
    
                // Mettez à jour les statistiques du profil
                setProfileData((prevProfileData) => ({
                    ...prevProfileData,
                    followers: followersList.length,
                    following: followingList.length,
                }));
            } else {
                console.error(`Échec du blocage de l'utilisateur avec userId: ${userId}`);
            }
        } catch (error) {
            console.error("Erreur lors du blocage de l'utilisateur:", error);
        }
    };

    // eslint-disable-next-line
    const updateProfile = async (newProfilePic) => {
        try {
            // Convertir newProfilePic en chaîne de caractères
            const profilePictureAsString = String(newProfilePic);

            // Mettre à jour profileData avant la requête
            setProfileData((prevProfileData) => ({
                ...prevProfileData,
                profilePic: profilePictureAsString,
            }));

            const response = await fetch("https://api-x-weld.vercel.app/api/users/656cf7b61068bdaf57421e21/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    // Ajoutez d'autres en-têtes nécessaires, par exemple, le jeton d'authentification
                },
                body: JSON.stringify({
                    username: profileData.username,
                    full_name: profileData.fullname,
                    bio: profileData.bio,
                    profile_picture: profilePictureAsString,  // Utilisez la nouvelle valeur convertie en chaîne
                    // Ajoutez d'autres champs que vous souhaitez mettre à jour
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
            } else {
                console.error("Échec de la mise à jour du profil.");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil:", error);
        }
    };








    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = '656cf7b61068bdaf57421e21'; // Remplacez par l'ID de l'utilisateur actuel

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
                console.log(profileDataFromServer);

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
    }, []);

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
                                    <p key={index}>
                                        <b>{follower}</b>
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
                                {followingList.map((following, index) => (
                                    <p key={index}>
                                        <b>{following}</b>
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
