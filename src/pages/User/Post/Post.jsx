import style from '../Post/post.module.css'
import { useContext, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import { FaComment, FaEllipsisH, FaHeart, FaUniversity } from 'react-icons/fa';
import { UserContext } from '../../../context/Context';
import DeletePost from '../../../components/CommunityComponents/DeletePost/DeletePost';
import Comments from '../../../components/CommunityComponents/Comments/Comments';
import Likes from '../../../components/CommunityComponents/Likes/Likes';
import Loader from '../../../Loader/Loader';


export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const userRole = localStorage.getItem('userRole');
  const canAddPost = userRole === 'Admin' || userRole === 'SubAdmin';
  const [loading, setLoading]=useState(true);
  const {
    showAddPostModal,
    setShowAddPostModal,
    showDeletePostModal,
    setShowDeletePostModal,
    showCommentsModal,
    setShowCommentsModal,
    showLikesModal,
    setShowLikesModal
  } = useContext(UserContext);


  const toggleAddPostModal = () => {
    setShowAddPostModal(!showAddPostModal);
  }

  const toggleDeletePostModal = (post) => {
    setSelectedPost(post);
    setShowDeletePostModal(!showDeletePostModal);
  }

  const toggleCommentsModal = (post) => {
    setSelectedPost(post);
    setShowCommentsModal(!showCommentsModal);
  }

  const toggleLikesModal = (post) => {
    setSelectedPost(post);
    setShowLikesModal(!showLikesModal);
  }

  const getPost = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/Posts/Get-Post-Link/${id}`);
      setPost(response.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

    const copyPostLink = (postId) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => toast.success('Post link copied!'))
      .catch(() => toast.error('Failed to copy link'));
  };
  // async function getPost(){
  //   try {
  //       const { data } = await axios.get(`https://localhost:7024/Posts/Get-Post-Link/${postId}`);
  //       setPost(data);
  //       const postUrl = `https://localhost:7024/Posts/Get-Post-Link/${postId}`;
  //       if (postUrl) {
  //         await navigator.clipboard.writeText(postUrl);
  //         toast.success("Post link copied to clipboard!");
  //       } else {
  //         toast.error("No link available to copy.");
  //       }
  //     } catch (error) {
  //       toast.error(error.response?.data || "An error occurred");
  //     }
  // }

    useEffect(() => {
    setLoading(true);
    getPost();
    const delay = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(delay);
  }, []);


  return (
    <>
    {loading? <Loader/>:<div className={style.communityPage}>
          <div className={style.postsContainer}>
            {isLoading ? (
              <div className={style.loadingState}>
                <div className={style.spinner}></div>
                <p>Loading post...</p>
              </div>
            ) : post ? (
              <div className={style.postCard} key={post.postId}>
                {/* Post Header */}
                <div className={style.postHeader}>
                  <Link to={`/profile/${post.posterId}`} className={style.postAuthor}>
                    <img
                      src={post?.profileImage}
                      alt={post.posterName}
                      className={style.authorAvatar}
                    />
                    <div className={style.authorInfo}>
                      <h3>{post.posterName}</h3>
                      {post?.universityName &&
                        <div className={style.universityBadge}>
                          <FaUniversity className={style.uniIcon} />
                          <span>{post?.university || ''}</span>
                        </div>
                      }
                      <time>{new Date(post.createdAt).toLocaleString()}</time>
                    </div>
                  </Link>


                  <div className={style.postOptions}>
                    <button className={style.optionsButton}>
                      <FaEllipsisH />
                    </button>
                    <div className={style.optionsDropdown}>
                      {(canAddPost) && (<button onClick={() => toggleDeletePostModal(post)}>Delete Post</button>)}
                      <button onClick={() => copyPostLink(post.postId)}>Copy Post Link</button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className={style.postContent}>
                  <h2 className={style.postTitle}>{post.title}</h2>
                  <p className={style.postText}>{post.description}</p>
                  {post?.postImage && (
                    <div className={style.postImageContainer}>
                      <img
                        src={post.postImage}
                        alt={post.title}
                        className={style.postImage}
                      />
                    </div>
                  )}
                </div>

                {/* Post Footer - Modified to match your original design */}
                <div className={style.postFooter}>
                  <div className={style.engagementButtons}>
                    <button
                      className={`${style.likeButton} ${post.isLiked ? style.liked : ''}`}
                      onClick={() => handleLike(post.postId)}
                    >
                      <FaHeart className={style.actionIcon} />
                      <span> Like</span>
                    </button>
                    <button
                      className={style.commentButton}
                      onClick={() => toggleCommentsModal(post)}
                    >
                      <FaComment className={style.actionIcon} />
                      <span>Comment</span>
                    </button>
                  </div>
                  <div className={style.numOfLikesAndComments}>
                    <div className={style.countsContainer}>
                      <span onClick={() => toggleCommentsModal(post)}>
                        {post.totalComments} {post.totalComments !== 1 ? 'Comments' : 'Comment'}
                      </span>
                      <span onClick={() => toggleLikesModal(post)}>
                        {post.totalLikes} {post.totalLikes !== 1 ? 'Likes' : 'Like'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            ) : (
              <div className={style.emptyState}>
                <h3>Post not found</h3>
              </div>
            )}


            {/* Delete Post Modal */}
            {showDeletePostModal && (
              <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                <div className="modal-dialog modal-dialog-centered modal-md">
                  <div className={`modal-content`}>
                    <div className="modal-header">
                      <button type="button" className="btn-close" onClick={toggleDeletePostModal}></button>
                    </div>
                    <div className="modal-body">
                      <DeletePost
                        post={selectedPost.postId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Modal */}
            {showCommentsModal && (
              <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                <div className="modal-dialog modal-dialog-centered ">
                  <div className={`${style.modalComments} modal-content`}>
                    <div className="modal-header">
                      <button
                        type="button"
                        className="btn-close"
                        onClick={toggleCommentsModal}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <Comments post={selectedPost} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Likes Modal */}
            {showLikesModal && (
              <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                <div className="modal-dialog modal-dialog-centered ">
                  <div className={`${style.modalLikes} modal-content`}>
                    <div className="modal-header">
                      <button
                        type="button"
                        className="btn-close"
                        onClick={toggleLikesModal}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <Likes postId={selectedPost.postId} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>}
          
    </>
  );
}