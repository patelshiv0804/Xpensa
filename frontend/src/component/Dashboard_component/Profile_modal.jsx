import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Dashboard_styles/Profile_modal.module.css';

const Profile_modal = ({ isOpen, onClose }) => {
    const userId = localStorage.getItem('userId') || '1';

    const [profile, setProfile] = useState({
        username: '',
        email: '',
        phone_number: '',
        dob: '',
        country: '',
        profile_img: null
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNewProfile, setIsNewProfile] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:3000/profile/check/${userId}`);
                const profileData = response.data.profile;

                setProfile({
                    username: profileData.username || '',
                    email: profileData.email || '',
                    phone_number: profileData.phone_number || '',
                    dob: profileData.dob ? profileData.dob.split('T')[0] : '',
                    country: profileData.country || '',
                    profile_img: null
                });

                if (profileData.profile_img) {
                    setPreviewImage(`${profileData.profile_img}`);
                }

                setIsNewProfile(false);
                setIsLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setIsNewProfile(true);
                    setIsLoading(false);
                } else {
                    setError('Failed to load profile. Please try again.');
                    setIsLoading(false);
                    console.error('Error fetching profile:', err);
                }
            }
        };

        if (isOpen && userId) {
            fetchProfile();
        }
    }, [isOpen, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(prev => ({
                ...prev,
                profile_img: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append('username', profile.username);
            formData.append('phone_number', profile.phone_number);
            formData.append('dob', profile.dob);
            formData.append('country', profile.country);
            formData.append('user_id', userId);
            formData.append('email', profile.email);

            if (profile.profile_img) {
                formData.append('profile_img', profile.profile_img);
            }

            let response;
            if (isNewProfile) {
                response = await axios.post('http://localhost:3000/profile/add', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await axios.post('http://localhost:3000/profile/edit', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setIsLoading(false);
            alert(response.data.message);
            onClose();
        } catch (err) {
            setIsLoading(false);
            setError('Failed to save profile. Please try again.');
            console.error('Error saving profile:', err);
        }
    };

    const handleOutsideClick = (e) => {
        if (e.target.className === styles.modal_overlay) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal_overlay} onClick={handleOutsideClick}>
            <div className={styles.modal_content}>
                <div className={styles.modal_header}>
                    <h2>{isNewProfile ? 'Create Profile' : 'Edit Profile'}</h2>
                    <button className={styles.close_button} onClick={onClose}>×</button>
                </div>

                {isLoading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.profile_form}>
                        <div className={styles.profile_preview}>
                            <div className={styles.avatar_container}>
                                <img
                                    src={previewImage || "logos/user.png"}
                                    alt="Profile"
                                    className={styles.preview_avatar}
                                />
                                <label htmlFor="profile_img" className={styles.change_photo}>
                                    Change Photo
                                </label>
                                <input
                                    type="file"
                                    id="profile_img"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className={styles.file_input}
                                />
                            </div>
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={profile.username}
                                onChange={handleChange}
                                required
                                className={styles.text_input}
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange} // Allow email to be changed if needed
                                className={styles.text_input}
                                readOnly
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="phone_number">Phone Number</label>
                            <input
                                type="tel"
                                id="phone_number"
                                name="phone_number"
                                value={profile.phone_number}
                                onChange={handleChange}
                                className={styles.text_input}
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="dob">Date of Birth</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                value={profile.dob}
                                onChange={handleChange}
                                className={styles.date_input}
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="country">Country</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={profile.country}
                                onChange={handleChange}
                                className={styles.text_input}
                            />
                        </div>

                        <div className={styles.button_group}>
                            <button
                                type="button"
                                onClick={onClose}
                                className={styles.cancel_button}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={styles.save_button}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile_modal;