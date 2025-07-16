import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../../context/Context";
import style from '../Likes/likes.module.css'
import { useFormik } from "formik";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Likes({ postId }) {
    const navigate = useNavigate();
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userProfile } = useContext(UserContext);


    async function getLikes() {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API}/Likes/Get-Likes/${postId}`
            );
            setLikes(data);
            console.log(data);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        getLikes();
    }, []);

    return (
        <div className={`${style.LikesContainer} `}>
            <div className={`${style.likespadding}`}>
                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) :
                    (
                        <>
                            {likes.length > 0 ? (
                                <div className={`${style.likesList}`}>
                                    {likes.map((like) => (
                                        <>
                                            <div key={like.likeId} className={`${style.like}`}>
                                                <div className={`${style.likeHeader}`}>
                                                    <Link to={`/profile/${like.userId}`}>
                                                        <div className={`${style.userInfo}`}>
                                                            <img
                                                                src={like.userImage}
                                                                className={`${style.userImage}`}
                                                                alt={like.userName}
                                                            />
                                                            <div>
                                                                <span className={`${style.userName}`}>{like.userName}</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className={`${style.likeContent}`}>
                                                    <p>{like.likeContent}</p>
                                                </div>

                                            </div>
                                            <div className={` ${style.LikeFooter}`}>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            ) : (
                                <p className={style.noLikes}>No Likes yet. Be the first to like!</p>
                            )}
                        </>)}
            </div>
        </div>
    );
}