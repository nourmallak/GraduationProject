import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../../context/Context";
import style from './deletePost.module.css';
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import Loader from "../../../Loader/Loader";

export default function DeletePost({ postId, onDeleteSuccess }) {
    const { showDeletePostModal, setShowDeletePostModal } = useContext(UserContext);
    const [isDeleting, setIsDeleting] = useState(false);

    async function deletePost() {
        setIsDeleting(true);
        try {
            const token = localStorage.getItem("user token");
            await axios.delete(`${import.meta.env.VITE_API}/Posts/Delete-Post/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success('Deleted Successfully', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            onDeleteSuccess(); // Callback to refresh posts
            setShowDeletePostModal(false);
        } catch (error) {
            toast.error(error.response?.data || "An error occurred", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        } finally {
            setIsDeleting(false);
        }
    }

    const cancleDelete = () => {
        setShowDeletePostModal(false);
    }

    return (
        <>
            {isDeleting ? (
                <div className={style.loadingState}>
                    <div className={style.spinner}></div>
                    <p>Deleting post...</p>
                </div>
            ) : (
                <div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete this post?</p>
                    </div>
                    <div className="modal-footer">

                        <>
                            <button
                                type="button"
                                className={`${style.cancleBtn}`}
                                onClick={cancleDelete}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={`${style.saveBtn}`}
                                onClick={deletePost}
                                disabled={isDeleting}
                            >
                                Yes, delete it!
                            </button>
                        </>
                   
                    </div>
                </div>) }
        </>
    );
}