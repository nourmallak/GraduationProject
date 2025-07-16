import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUniversity, FaPlus, FaEllipsisH, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { UserContext } from '../../../context/Context';
import style from '../Community/community.module.css';
import Loader from '../../../Loader/Loader';
import AddPost from '../../../components/CommunityComponents/AddPost/AddPost';
import DeletePost from '../../../components/CommunityComponents/DeletePost/DeletePost';
import Comments from '../../../components/CommunityComponents/Comments/Comments';
import Likes from '../../../components/CommunityComponents/Likes/Likes';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('PCPC');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
const token = localStorage.getItem('user token');
const userRole = localStorage.getItem('userRole');
const canAddPost = token && (userRole === 'Admin' || userRole === 'Sub_Admin');  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);


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

  const fetchUniversities = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API}/University/GetAllUniversitiesforRigister`);
      setUniversities([{ universityId: 'PCPC', name: 'PCPC Posts' }, ...data]);
    } catch (error) {
      console.error('University fetch error:', error);
    }
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let url;
      if (selectedUniversity === 'PCPC') {
        url = `${import.meta.env.VITE_API}/Posts/Get-Posts?pageIndex=1&PageSize=5&type=0`;
      } else {
        url = `${import.meta.env.VITE_API}/Posts/Get-Posts-By-University-Name?universityId=${selectedUniversity}&pageIndex=1&PageSize=5`;
      }

      const { data } = await axios.get(url);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Posts fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('user token');
      await axios.post(`${import.meta.env.VITE_API}/Likes/toggle/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (error) {
      const token= localStorage.getItem('user token') || '';
      {token? toast.error('Failed to update like') : toast.error('login to set like')}
      
      console.error('Like error:', error);
    }
  };

  const copyPostLink = (postId) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => toast.success('Post link copied!'))
      .catch(() => toast.error('Failed to copy link'));
  };


  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const token = localStorage.getItem('user token');
      if (!token) {
        console.error('No token found!');
        return;
      }

      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/UsersProfile/Get-User-Profile-By-Name/${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Search result:', data);
      setSearchResults(data);
    } catch (error) {
      console.error('Profile search error:', error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchUniversities();
    const delay = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPosts();
    const delay = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(delay);
  }, [selectedUniversity]);

  return (
    <div className={style.communityPage}>
      {loading ? <Loader /> : (
        <>
          {/* Header Section */}
          <div className={style.header}>
            <div className={style.headerContent}>
              <h1>Community</h1>
              <p>Palestinian Students Programming Community</p>
            </div>

            <div className={style.profileSearch}>
              <input
                type="text"
                placeholder="Search profiles..."
                value={searchQuery}
                onChange={handleSearch}
                className={style.searchInput}
              />
              {searchQuery && (
                <div className={style.searchResults}>
                  {searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <div>
                        <Link
                          key={user.id}
                          to={`/profile/${user.id}`}
                          className={style.resultItem}
                          onClick={() => setSearchQuery('')}
                        >
                          <img src={user?.userProfileImage} alt={user.name} className={style.userImage} />

                          <div className={style.info}>
                            <h3 className={style.userName}>{user.userName}</h3>
                            {user?.university ? (
                              <span className={style.university}>{user.university}</span>
                            ) : <div className='mt-3'></div>}
                          </div>
                        </Link>
                        <div className={style.divider}>

                        </div>
                      </div>

                    ))
                  ) : (
                    <p className={style.noResultText}>No profiles found.</p>
                  )}
                </div>
              )}
            </div>
          </div>



          {/* Filter Section */}
          <div className={style.filterSection}>
            <div className={canAddPost ? style.filterCard : style.filterCardUser}>
              {canAddPost && (
                <button className={style.addPostButton} onClick={toggleAddPostModal}>
                  <FaPlus className={style.addIcon} />
                  <span>Create Post</span>
                </button>
              )}

              <div className={style.universityFilter}>
                <FaUniversity className={style.filterIcon} />
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className={style.universitySelect}
                >
                  {universities.map((uni) => (
                    <option key={uni.universityId} value={uni.universityId}>
                      {uni.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className={style.postsContainer}>
            {isLoading ? (
              <div className={style.loadingState}>
                <Loader />
                <p>Loading posts...</p>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
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
                        {post?.universityName ? (
                          <div className={style.universityBadge}>
                            <FaUniversity className={style.uniIcon} />
                            <span>{post.university || ''}</span>
                          </div>
                        ) : <div className='mt-1'></div>}
                        <time>{new Date(post.createdAt).toLocaleString()}</time>
                      </div>
                    </Link>


                    <div className={style.postOptions}>
                      <button className={style.optionsButton}>
                        <FaEllipsisH />
                      </button>
                      <div className={style.optionsDropdown}>
                        {(canAddPost) && (
                          <button onClick={() => toggleDeletePostModal(post)}>Delete Post</button>
                        )}
                        <button onClick={() => copyPostLink(post.postId)}>Copy Post Link</button>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className={style.postContent}>
                    <h2 className={style.postTitle}>{post.title}</h2>
                    <p className={style.postText}>{post.description}</p>
                    {post.postImage && (
                      <div className={style.postImageContainer}>
                        <img
                          src={post.postImage}
                          alt={post.title}
                          className={style.postImage}
                        />
                      </div>
                    )}
                  </div>

                  {/* Post Footer */}
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
              ))
            ) : (
              <div className={style.emptyState}>
                <h3>No posts yet</h3>
                <p>Be the first to share something in this community!</p>
                {(userRole === 'SubAdmin') && (
                  <button className={style.ctaButton} onClick={toggleAddPostModal}>
                    Create Your First Post
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Add Post Modal */}
          {showAddPostModal && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className={`modal-content`}>
                  <div className="modal-header">
                    <h5 className="modal-title">Add New Post</h5>
                    <button type="button" className="btn-close" onClick={toggleAddPostModal}></button>
                  </div>
                  <div className="modal-body">
                    <AddPost onSuccess={fetchPosts} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Post Modal */}
          {showDeletePostModal && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className={`modal-content`}>
                  <div className="modal-header">
                    <button type="button" className="btn-close" onClick={() => setShowDeletePostModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <DeletePost
                      postId={selectedPost.postId}
                      onDeleteSuccess={fetchPosts}
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
        </>
      )}
    </div>
  );
}