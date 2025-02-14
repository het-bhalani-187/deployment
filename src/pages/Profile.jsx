import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';
import logo from '../assets/images/lawbg.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faBriefcase, faGavel } from '@fortawesome/free-solid-svg-icons';
import api from '../utils/axios';
import { toast } from 'react-toastify';

const MIN_LAWYER_EXPERIENCE = 2;

const Profile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    
    const [profileImage, setProfileImage] = useState(logo);
    const [userName, setUserName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [profession, setProfession] = useState(user?.role || '');
    const [experience, setExperience] = useState(user?.experience || 0);
    const [specialization, setSpecialization] = useState(user?.specialization || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [nation, setNation] = useState(user?.nation || '');
    const [gender, setGender] = useState(user?.gender || 'male');
    const [language, setLanguage] = useState(user?.language || 'english');
    const [dob, setDob] = useState(user?.dob || { day: '', month: '', year: '' });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const specializations = [
        'Criminal Law',
        'Civil Law',
        'Family Law',
        'Corporate Law',
        'Property Law',
        'Immigration Law',
        'General Practice'
    ];

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (user) {
            setUserName(user.name || '');
            setEmail(user.email || '');
            setProfession(user.role || '');
            setExperience(user.experience || 0);
            setSpecialization(user.specialization || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
            setNation(user.nation || '');
            setGender(user.gender || 'male');
            setLanguage(user.language || 'english');
            setDob(user.dob || { day: '', month: '', year: '' });
        }
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            // Validate experience for lawyers
            if (profession === 'lawyer') {
                if (!experience || experience < 0) {
                    setError('Please enter valid years of experience');
                    return;
                }
                if (!specialization) {
                    setError('Please select your specialization');
                    return;
                }
            }

            const token = localStorage.getItem('token');
            const response = await api.put('/auth/profile', {
                name: userName,
                email,
                phone,
                address,
                nation,
                gender,
                language,
                dob,
                role: profession,
                experience: profession === 'lawyer' ? experience : undefined,
                specialization: profession === 'lawyer' ? specialization : undefined
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local storage and context with new user data
            const updatedUser = response.data.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            setSuccess('Profile updated successfully!');
            toast.success('Profile updated successfully!');

            // If lawyer doesn't meet experience requirement, show warning
            if (profession === 'lawyer' && experience < MIN_LAWYER_EXPERIENCE) {
                toast.warning(`Note: You need at least ${MIN_LAWYER_EXPERIENCE} years of experience to answer questions in the courtroom.`);
            }
            
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update profile';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleChangePasswordClick = () => {
        setIsChangingPassword(!isChangingPassword);
    };

    const handleSaveNewPassword = async () => {
        setError('');
        setSuccess('');
        
        try {
            if (!password || !newPassword) {
                setError('Please fill in all password fields');
                return;
            }

            const token = localStorage.getItem('token');
            await api.put('/auth/change-password', {
                currentPassword: password,
                newPassword: newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Password changed successfully!');
            setPassword('');
            setNewPassword('');
            setIsChangingPassword(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        }
    };

    if (!user) {
        return <navigate to="/login" />;
    }

    return (
        <div className="profile-background border-2 border-blue-500 p-10 gradient-bg">
            <div className="content">
                <h2><center>My Profile</center></h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="profile-section"> 
                        <img
                            src={profileImage} alt="Profile" className="profile-image"
                        />
                        <label className="change-photo">
                            Change Photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">User  Name</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            className="full-width"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profession">Profession</label>
                        <select 
                            value={profession} 
                            onChange={(e) => setProfession(e.target.value)}
                        >
                            <option value="">Select Profession</option>
                            <option value="civilian">Civilian</option>
                            <option value="lawyer">Lawyer</option>
                            <option value="law_student">Law Student</option>
                        </select>
                    </div>
                    {profession === 'lawyer' && (
                        <div>
                            <div className="form-group">
                                <label>
                                    <FontAwesomeIcon icon={faBriefcase} className="icon" />
                                    Years of Experience
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={experience}
                                    onChange={(e) => setExperience(parseFloat(e.target.value))}
                                />
                                {experience < MIN_LAWYER_EXPERIENCE && (
                                    <div className="experience-warning">
                                        Note: You need at least {MIN_LAWYER_EXPERIENCE} years of experience to answer questions
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>
                                    <FontAwesomeIcon icon={faGavel} className="icon" />
                                    Specialization
                                </label>
                                <select 
                                    value={specialization} 
                                    onChange={(e) => setSpecialization(e.target.value)}
                                >
                                    <option value="">Select Specialization</option>
                                    {specializations.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                setPhone(value);
                            }}
                            pattern="\d*"
                            title="Please enter a valid phone number (digits only)"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                            id="address"
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nation">Nation</label>
                        <input
                            id="nation"
                            type="text"
                            placeholder="Country"
                            value={nation}
                            onChange={(e) => setNation(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <label htmlFor="language">Language</label>
                        <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <option value="english">English</option>
                            <option value="hindi">Hindi</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <select className="border rounded p-2 w-full" value={dob.day} onChange={(e) => setDob({ ...dob, day: e.target.value })}>
                            <option value="">Day</option>
                            {[...Array(31)].map((_, i) => (
                                <option key={i} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <select className="border rounded p-2 w-full" value={dob.month} onChange={(e) => setDob({ ...dob, month: e.target.value })}>
                            <option value="">Month</option>
                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, i) => (
                                <option key={i} value={i + 1}>{month}</option>
                            ))}
                        </select>
                        <select className="border rounded p-2 w-full" value={dob.year} onChange={(e) => setDob({ ...dob, year: e.target.value })}>
                            <option value="">Year</option>
                            {[...Array( 100)].map((_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <option key={i} value={year}>{year}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor ="password">Password</label>
                        <div className="password-input">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </span>
                        </div>
                        <span className="change-password" onClick={handleChangePasswordClick}>
                            {isChangingPassword ? 'CANCEL' : 'CHANGE PASSWORD'}
                        </span>
                    </div>
                    {isChangingPassword && (
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <div className="password-input">
                                <input
                                    id="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                </span>
                            </div>
                            <button type="button" className="btn save-password" onClick={handleSaveNewPassword}>
                                Save
                            </button>
                        </div>
                    )}
                    <div className="actions">
                        <button type="submit" className="btn save">
                            Save
                        </button>
                        <button type="button" className="btn cancel" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;