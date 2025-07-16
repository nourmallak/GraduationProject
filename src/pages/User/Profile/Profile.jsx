import style from '../Profile/profile.module.css'
import pin from '../../../images/profileImages/pin.png';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Loader from '../../../Loader/Loader';
import { UserContext } from '../../../context/Context';
import { EditProfile } from '../../../components/ProfileComponents/editProfile/EditProfile';
import UpdatePersonalExperience from '../../../components/ProfileComponents/PersonalExperience/UpdatePersonalExperience/UpdatePersonalExperience';
import DeletePersonalExperience from '../../../components/ProfileComponents/PersonalExperience/DeletePersonalExperience/DeletePersonalExperience';
import { AddPersonalExperience } from '../../../components/ProfileComponents/PersonalExperience/AddPersonalExperience/AddPersonalExperience';

export function Profile() {
    const { userProfile, setUserProfile, showEditProfile, setShowEditProfile, showCreatePersonalExperienceModal, setShowCreatePersonalExperienceModal, showUpdatePersonalExperienceModal,
        setShowUpdatePersonalExperienceModal, setShowDeletePersonalExperienceModal, showDeletePersonalExperienceModal } = useContext(UserContext);

    const [userProfileCopy, setUserProfileCopy] = useState(null);
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem('userRole');
    const [isUser, setIsUser] = useState(role === 'User' ? true : false);
    const { id } = useParams();
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleProfileAction = async (action) => {
        setIsProcessing(true);
        try {
            await action();
            await getUserProfile();
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    async function getUserProfile() {
        const token = localStorage.getItem("user token");
        const decoded = jwtDecode(token);
        console.log("decoded:", decoded);

        const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

        setIsCurrentUser(userId === id);

        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/UsersProfile/Profile/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(data);
            setUserProfile(data);
            setUserProfileCopy(data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    }

    const toggleModal = () => {
        setShowEditProfile(!showEditProfile);
    }

    const togglePersonalExperienceModal = () => {
        setShowCreatePersonalExperienceModal(!showCreatePersonalExperienceModal);
    }

    const toggleUpdatePersonalExperienceModal = () => {
        setShowUpdatePersonalExperienceModal(!showUpdatePersonalExperienceModal);
    }

    const toggleDeletePersonalExperienceModal = () => {
        setShowDeletePersonalExperienceModal(!showDeletePersonalExperienceModal);
    }

    useEffect(() => {
        setLoading(true);
        getUserProfile();
        const delay = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(delay);
    }, []);

    return (
        <>
            {loading ? <Loader />
                :
                <div className={`${style.body}`}>
                    <div className="container">
                        <div className={`${style.profileContainer}`}>
                            <div className={`${style.cover}`}></div>
                            <div className={`${style.info}`}>
                                <img
                                    src={userProfileCopy?.image}
                                    alt='Profile'
                                    className={`${style.personalimg}`}
                                />

                                {isCurrentUser && (
                                    <button
                                        className={`${style.editProfile} d-flex align-items-center`}
                                        onClick={toggleModal}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="#000000" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                                        </svg>
                                        <span>Edit Profile</span>
                                    </button>
                                )}

                                {showEditProfile && (
                                    <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                                        <div className="modal-dialog modal-dialog-centered modal-md">
                                            <div className={`${style.editProfileModal} modal-content`}>
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Edit Profile</h5>
                                                    <button type="button" className="btn-close" onClick={toggleModal}></button>
                                                </div>
                                                <div className="modal-body">
                                                    <EditProfile toggleModal={toggleModal} onSuccess={() => handleProfileAction(() => getUserProfile())} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <h4 className={`${style.profileName}`}>
                                    <div>{userProfileCopy?.userName}</div>

                                </h4>

                                {userProfileCopy?.universityName &&
                                    <span className={`${style.uni}`}>
                                        {userProfileCopy?.universityName || null}
                                    </span>
                                }

                                {/* Description Section */}
                                {console.log(userProfileCopy?.description)}
                                {(isCurrentUser || (!(userProfileCopy?.description === 'No description provided.'))) &&
                                    (<div className={`${style.descriptionSection}`}>
                                        <h3 className={`${style.sectionTitle} d-flex  justify-content-between`}>
                                            <span>
                                                <img src={pin} className={`${style.pin}`} alt="Pin icon" />
                                                About
                                            </span>
                                            {isCurrentUser && (!(userProfileCopy?.description === 'No description provided.')) && (
                                                <button
                                                    onClick={toggleModal}
                                                    className={`${style.editDescriptionBtn}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                        <path fill="#000000" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                                                    </svg>                                                
                                                    </button>
                                            )}
                                        </h3>
                                        <div className={`${style.descriptionContent}`}>
                                            {(!(userProfileCopy?.description === 'No description provided.')) ? (
                                                <p>{userProfileCopy?.description}</p>
                                            ) : isCurrentUser ? (
                                                <button
                                                    onClick={toggleModal}
                                                    className={`${style.addDescriptionBtn}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                        <path fill="#f8a70f" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                                                    </svg>
                                                    Add your description
                                                </button>
                                            ) : (
                                                <p className={`${style.noDescription}`}>No description available</p>
                                            )}
                                        </div>
                                    </div>)
                                }

                                {/* Social Links */}
                                <div className={`${style.socialLinks}`}>
                                    <ul className="d-flex flex-wrap justify-content-center">
                                        {/* Email */}
                                        <Link to={`mailto:${userProfileCopy?.email}`} className='col col-md-2'>
                                            <li>
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                        <path fill="#f8a70f" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                                                    </svg>
                                                    <span>Contact me</span>
                                                </div>
                                            </li>
                                        </Link>

                                        {/* GitHub */}
                                        {userProfileCopy?.githubLink ? (
                                            <Link to={userProfileCopy.githubLink} className='col  col-md-2'>
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                                                        <path fill="#f8a70f" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                                                    </svg>
                                                    <span>My GitHub</span>
                                                </li>
                                            </Link>
                                        ) : (
                                            isCurrentUser && (
                                                <Link onClick={toggleModal} className='col col-md-2'>
                                                    <li>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                            <path fill="#f8a70f" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                                                        </svg>
                                                        <span>Add GitHub</span>
                                                    </li>
                                                </Link>
                                            )
                                        )}

                                        {/* CV */}
                                        {userProfileCopy?.cv ? (
                                            <Link to={userProfileCopy.cv} className='col col-md-2'>
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                        <path fill="#f8a70f" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                                                    </svg>
                                                    <span>My CV</span>
                                                </li>
                                            </Link>
                                        ) : (
                                            isCurrentUser && (
                                                <Link onClick={toggleModal} className='col col-md-2'>
                                                    <li>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                            <path fill="#f8a70f" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                                                        </svg>
                                                        <span>Add CV</span>
                                                    </li>
                                                </Link>
                                            )
                                        )}

                                        {/* LinkedIn */}
                                        {userProfileCopy?.linkedInLink ? (
                                            <Link to={userProfileCopy.linkedInLink} className='col col-md-2'>
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                        <path fill="#f8a70f" d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                                                    </svg>
                                                    <span>My LinkedIn</span>
                                                </li>
                                            </Link>
                                        ) : (
                                            isCurrentUser && (
                                                <Link onClick={toggleModal} className='col col-md-2'>
                                                    <li>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                            <path fill="#f8a70f" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                                                        </svg>
                                                        <span>Add LinkedIn</span>
                                                    </li>
                                                </Link>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Personal Experience Section*/}
                        {(userProfileCopy?.personalExperienceContent || isCurrentUser) && isUser && (
                            <div className={`${style.experience}`}>
                                <div className='d-flex justify-content-between'>
                                    <div className='d-flex'>
                                        <h3>Personal experiences</h3>
                                        <img src={pin} className={`${style.pin}`} />
                                    </div>
                                    {isCurrentUser && userProfileCopy?.personalExperienceContent && (
                                        <div className='d-flex'>
                                            <a onClick={toggleUpdatePersonalExperienceModal}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path fill="#f8a70f" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                                                </svg>
                                            </a>
                                            {showUpdatePersonalExperienceModal && (
                                                <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                                                    <div className="modal-dialog modal-dialog-centered modal-md">
                                                        <div className={`${style.editProfileModal} modal-content`}>
                                                            <div className="modal-header">
                                                                <h5 className="modal-title">Update Your Personal Experience</h5>
                                                                <button type="button" className="btn-close" onClick={toggleUpdatePersonalExperienceModal}></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <UpdatePersonalExperience onSuccess={() => handleProfileAction(() => getUserProfile())} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <a onClick={toggleDeletePersonalExperienceModal}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                                    <path fill="#f8a70f" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                                </svg>
                                            </a>
                                            {showDeletePersonalExperienceModal && (
                                                <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                                                    <div className="modal-dialog modal-dialog-centered modal-md">
                                                        <div className={`${style.editProfileModal} modal-content`}>
                                                            <div className="modal-header">
                                                                <h5 className="modal-title">Delete Your Personal Experience</h5>
                                                                <button type="button" className="btn-close" onClick={toggleDeletePersonalExperienceModal}></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <DeletePersonalExperience onSuccess={() => handleProfileAction(() => getUserProfile())} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className={`${style.experienceDesc}`}>
                                    {userProfileCopy?.personalExperienceContent ? (
                                        <p>{userProfileCopy?.personalExperienceContent}</p>
                                    ) : (
                                        userProfile.isReviewed ? (
                                            <div>
                                                <p>Your experience is under review. Please wait for approval.</p>
                                            </div>
                                        ) : (
                                            isCurrentUser && (
                                                <div>
                                                    <Link
                                                        onClick={togglePersonalExperienceModal}
                                                        className={`${style.links} col-lg-3 col-md-6 col-sm-12`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                            <path fill="#f8a70f" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                                                        </svg>
                                                        <span>Add your Personal Experience</span>
                                                    </Link>
                                                    {showCreatePersonalExperienceModal && (
                                                        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                                                            <div className="modal-dialog modal-dialog-centered modal-md">
                                                                <div className={`${style.editProfileModal} modal-content`}>
                                                                    <div className="modal-header">
                                                                        <h5 className="modal-title">Enter Your Personal Experience</h5>
                                                                        <button
                                                                            type="button"
                                                                            className="btn-close"
                                                                            onClick={togglePersonalExperienceModal}
                                                                        ></button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        <AddPersonalExperience onSuccess={() => handleProfileAction(() => getUserProfile())} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                         {(userProfileCopy?.personalExperienceContent)  && (!(isUser)) && (
                            <div className={`${style.experience}`}>
                                <div className='d-flex justify-content-between'>
                                    <div className='d-flex'>
                                        <h3>Personal experience</h3>
                                        <img src={pin} className={`${style.pin}`} />
                                    </div>
                                </div>
                                <div className={`${style.experienceDesc}`}>
                                        <p>{userProfileCopy?.personalExperienceContent}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            }
        </>
    );
}