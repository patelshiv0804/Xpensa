import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Dashboard_styles/Profile.module.css';
import Profile_modal from './Profile_modal';

const Profile = () => {
    const userId = localStorage.getItem('userId') || '1';

    const [profileData, setProfileData] = useState({
        username: 'Your Name',
        email: 'your.email@example.com',
        profileImg: 'logos/user.png'
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchProfileData();
        }
    }, [userId]);

    const fetchProfileData = async () => {
        try {
            const response = await axios.get(`https://xpensa.onrender.com/profile/check/${userId}`);
            const data = response.data.profile;

            setProfileData({
                username: data.username || 'Your Name',
                email: data.email || 'your.email@example.com',
                profileImg: data.profile_img
                    ? `${data.profile_img}`
                    : 'logos/user.png'
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        fetchProfileData();
    };

    return (
        <>
            <div className={styles.user_background}>
                <img className={styles.user} src={profileData.profileImg} alt="User" />
                <div className={styles.user_details}>
                    <p className={styles.username}>{profileData.username}</p>
                    <p className={styles.email}>{profileData.email}</p>
                </div>
                <button className={styles.edit_button} onClick={openModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                    <span className={styles.edit_tooltip}>Edit Profile</span>
                </button>
            </div>

            {isModalOpen && (
                <Profile_modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    userId={userId}
                />
            )}
        </>
    );
};

export default Profile;
