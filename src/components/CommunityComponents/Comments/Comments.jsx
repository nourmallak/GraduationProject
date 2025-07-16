import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../../context/Context";
import style from '../Comments/comments.module.css'
import { useFormik } from "formik";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DeleteComment from "../DeleteComment/DeleteComment";

export default function Comments({ post }) {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userProfile } = useContext(UserContext);
    const token = localStorage.getItem('user token') || "";
    let decoded = "";
    if (token) {
        try {
            decoded = jwtDecode(token);
        } catch (error) {
            console.error("Invalid token", error);
        }
    }
    const role = localStorage.getItem('userRole') || '';
    const [isAdmin, setIsAdmin] = useState(role === 'Admin');


    const { showDeleteCommentModal, setShowDeleteCommentModal } = useContext(UserContext);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const formik = useFormik({
        initialValues: {
            content: ''
        },
        onSubmit: addComment
    })

    async function addComment(values) {
        try {
            const token = localStorage.getItem("user token");
            if (!token) {
                toast.error("Please login to comment", {
                    position: "bottom-right",
                    autoClose: 5000,
                    theme: "light",
                    transition: Bounce,
                });
                return;
            }

            // const decoded = jwtDecode(token);
            const { data } = await axios.post(
                `${import.meta.env.VITE_API}/Comments/Add-Comment/${post.postId}`,
                {
                    content: formik.values.content
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success('Comment added successfully', {
                position: "bottom-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });

            formik.resetForm();
            getComments();
        } catch (error) {
            toast.error(error.response?.data || "Failed to add comment", {
                position: "bottom-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });
        }
    }

    const toggleDeleteCommentModal = (commentId) => {
        setSelectedCommentId(commentId);
        setShowDeleteCommentModal(!showDeleteCommentModal);
    };

    async function getComments() {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${import.meta.env.VITE_API}/Comments/Get-comments/${post.postId}`
            );
            setComments(data);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    // async function deleteComment(commentId) {
    //     try {
    //         const token = localStorage.getItem("user token");
    //         await axios.delete(
    //             `${import.meta.env.VITE_API}/Comments/Delete-Comment/${commentId}`,
    //             {
    //                 headers: {
    //                     'Authorization': `${token}`
    //                 }
    //             }
    //         );

    //         toast.success('Comment deleted successfully', {
    //             position: "bottom-right",
    //             autoClose: 5000,
    //             theme: "light",
    //             transition: Bounce,
    //         });

    //         getComments();
    //     } catch (error) {
    //         toast.error(error.response?.data || "Failed to delete comment", {
    //             position: "bottom-right",
    //             autoClose: 5000,
    //             theme: "light",
    //             transition: Bounce,
    //         });
    //     }
    // }

    const handleCompetitionAction = async (action) => {
        setIsProcessing(true);
        try {
            await action();
            await getComments();
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        getComments();
    }, []);

    return (
        <div className={`${style.commentsContainer} `}>
            <div className={`${style.commentspadding}`}>
                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : comments.length > 0 ? (
                    <div className={`${style.commentsList}`}>
                        {comments.map((comment) => (
                            <div key={comment.commentId} className={`${style.comment}`}>
                                <div className={`${style.commentHeader}`}>
                                    <Link to={`/profile/${comment.userId}`}>
                                        {console.log(`${comment.userId}`)}
                                        <div className={`${style.userInfo}`}>
                                            <img
                                                src={comment.userImage}
                                                className={`${style.userImage}`}
                                                alt={comment.userName}
                                            />
                                            <div>
                                                <span className={`${style.userName}`}>{comment.userName}</span>
                                                <small>{new Date(comment.createdAt).toLocaleString()}</small>
                                            </div>
                                        </div>
                                    </Link>

                                    {((decoded?.sub === comment.userName) || (decoded?.sub === post.posterName)) && (
                                        <button
                                            onClick={() => toggleDeleteCommentModal(comment.commentId)}
                                            className={`${style.deleteButton}`}
                                        >
                                            Delete
                                        </button>
                                    )}

                                </div>
                                <div className={`${style.commentContent}`}>
                                    <p>{comment.commentContent}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={style.noComments}>No comments yet. Be the first to comment!</p>
                )}
                {token ? (
                    <form onSubmit={formik.handleSubmit} className={style.commentForm}>
                        <div className={style.formGroup}>
                            <input
                                className={style.commentInput}
                                id="content"
                                placeholder="Write your comment here..."
                                name="content"
                                value={formik.values.content}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                            />
                            <button
                                type="submit"
                                className={style.submitButton}
                                disabled={!formik.values.content || formik.isSubmitting}
                            >
                                {formik.isSubmitting ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="#ffffff" d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className={style.loginPrompt}>
                        <Link to="/signin" className={style.loginLink}>
                            Login to leave a comment
                        </Link>
                    </div>
                )}

                <DeleteComment
                    show={showDeleteCommentModal}
                    onHide={toggleDeleteCommentModal}
                    commentId={selectedCommentId}
                    onSuccess={() => handleCompetitionAction(() => getComments())}
                />
            </div>
        </div>
    );
}
