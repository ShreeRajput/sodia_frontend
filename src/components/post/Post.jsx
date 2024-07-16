import './post.css';
import { LocationOn, Label } from "@mui/icons-material";
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { UserContext } from '../../context/userContext';
import { Link } from 'react-router-dom';
import PostComments from './PostComments';

export default function Post({ post }) {
  const [userLogged] = useContext(UserContext);
  let [likes, setLikes] = useState(post.likes.length);
  let [isLiked, setIsLiked] = useState(post.likes.includes(userLogged.details._id));
  let [isBookmarked, setIsBookMarked] = useState(post.bookmarks?.includes(userLogged.details._id));
  let [user, setUser] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [cmtCnt,setCmtCnt] = useState(post.comments?.length)
  const [showConfirmation, setShowConfirmation] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const fetchUser = async () => {
      axios.get('/users?userId=' + post.userId)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.log("error occured in post.jsx ", error);
        });
    };

    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    setLikes(() => {
      return isLiked ? likes - 1 : likes + 1;
    });

    axios.put(`/posts/${post._id}/like`, { "userId": userLogged.details._id })
      .then(response => { })
      .catch(error => {
        console.log(error);
      });

    setIsLiked(!isLiked);
  };

  const BookmarkHandler = () => {
    axios.put(`/posts/${post._id}/bookmark`, { "userId": userLogged.details._id })
      .then(response => { })
      .catch(error => {
        console.log(error);
      });

    setIsBookMarked(!isBookmarked);
  };

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    axios.delete(`/posts/${post._id}`, { data: { userId: userLogged.details._id } })
      .then(response => {
        setShowConfirmation(false);
        window.location.reload() 
      })
      .catch(error => console.log(error));
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  }

  const isImage = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/i);
  }

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={user.username && `/profile/${user.username}`} className="linkContainer">
              <img
                className="postProfileImg"
                src={user.profilePicture || PF + "person/noAvatar.png"}
                alt="profile_picture"
              />
              <span className="postUsername">
                {user.username}
              </span>
            </Link>

            <span className="postDate">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="postTopRight">
            {post.userId === userLogged.details._id ? <button className='deleteButton' onClick={handleDelete}>Delete</button>
              :
              isBookmarked ? <BookmarkAddedIcon htmlColor='#800080' onClick={BookmarkHandler} /> : <BookmarkBorderIcon onClick={BookmarkHandler} />}
          </div>
        </div>

        <div className="postCenter">
          <span className="postText">{post?.description}</span>
          {isImage(post.img) ? (
              <img
                className="postImg"
                src={post.img}
                alt="post_image"
                onDoubleClick={() => !isLiked && likeHandler()}
              />
              ) : (
                <video controls className="postImg">
                  <source src={post.img} type={`video/${post.img.split('.').pop()}`} />
                  Your browser does not support the video tag.
                </video>
              ) 
          }
        </div>

        <div className="postBottom">
          <div className="postBottomLeft">
            {isLiked ? <FavoriteIcon className="likeIcon" htmlColor="#800080" onClick={likeHandler} />
              : <FavoriteBorderIcon className="likeIcon" onClick={likeHandler} />}
            <span className="postLikeCounter">{likes} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText" onClick={() => setShowComments(true)}>{cmtCnt} comments</span>
          </div>
        </div>

        {showComments && <PostComments post={post} setShowComments={setShowComments} setCmtCnt={setCmtCnt} />}

        {(post.tags || post.location) && (
          <div className="shareSelectedTagsLocation">
            {post.location && <div className="shareSelectedLocation"><span style={{ fontWeight: "500", color: "black" }}>Location: </span> <LocationOn htmlColor="green" className='postIcon' /> {post.location}</div>}
            {post.tags && <div className="shareSelectedTags"><span style={{ fontWeight: "500", color: "black" }}>Tags:</span> <Label htmlColor="blue" className="postIcon" /> {post.tags}</div>}
          </div>
        )}

        {showConfirmation && (
          <div className="confirmationAlert">
            <p>Are you sure to delete this post?</p>
            <button className="cancelButton" onClick={cancelDelete}>No</button>
            <button className="confirmButton" onClick={confirmDelete}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}
