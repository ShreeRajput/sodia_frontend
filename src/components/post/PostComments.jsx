import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import './postComments.css';
import { UserContext } from '../../context/userContext';
import { Link } from 'react-router-dom'
import {Cancel} from "@mui/icons-material"

const PostComments = ({post,setShowComments,setCmtCnt}) => {
  const [userLogged] = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isCmtFetching, setIsCmtFetching] = useState(false);
  const [users, setUsers] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(`/users?userId=${userId}`);
      setUsers(prevUsers => [...prevUsers, response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      setIsCmtFetching(true);
      try {
        const response = await axios.get(`/posts/${post._id}`);
        setComments(response.data.comments.reverse());
        setIsCmtFetching(false);
      } catch (error) {
        console.log(error);
        setIsCmtFetching(false);
      }
    };
    fetchComments();
  }, [post._id]);

  useEffect(() => {
    comments.forEach(comment => {
      if (!users.find(user => user._id === comment.userId)) {
        fetchUser(comment.userId);
      }
    });
  }, [comments,users]);

  const handleComment = async () => {
    const comment = {
      userId: userLogged?.details._id,
      cmt: newComment
    };

    if (newComment.trim()) {
      setIsCommenting(true);
      try {
        await axios.put(`/posts/${post._id}`, comment);
        setComments([comment, ...comments]); // Add new comment at the beginning
        setNewComment("");
        setIsCommenting(false);
        setCmtCnt(prev=>prev+1)
      } catch (error) {
        console.log(error);
        setIsCommenting(false);
      }
    }
  };

  return (
    <div className="modal-background" onClick={() => setShowComments(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Comments</h2>
        </div>
        <Cancel className="cancel-icon" onClick={() => setShowComments(false)} />
        <div className="input-container">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="fancy-input"
          />
          <button onClick={handleComment} className="comment-button" disabled={isCommenting}>
            {isCommenting ? <div className="spinners"></div> : 'Comment'}
          </button>
        </div>
        {isCmtFetching ? 
          <div className="spinner-container">
            <div className="spinners"></div>
          </div>
        : 
        <ul className="comment-list">
            {comments.map((comment, index) => {
              const user = users.find(user => user._id === comment.userId);
              return (
                <li key={index} className="comment-item">
                  {user ? (
                    <div style={{display:"flex", flexWrap: "wrap"}}>
                      <Link to={"/profile/" + user?.username} style={{textDecoration:"none"}}>
                          <img src={user.profilePicture || (PF + "person/noAvatar.png")} alt={user.username} className="profile-picture" />                      
                      </Link>
                      <div className="comment-content">
                        <Link to={"/profile/" + user?.username} style={{textDecoration:"none",marginBottom:"5px",marginTop:"5px"}}>
                            <span className="username">{user.username}</span>
                        </Link>
                        <span className="comment-text">{comment.cmt}</span>
                      </div>
                    </div>
                  ) : 'Loading...'}
                </li>
              );
            })}
        </ul>
        }
      </div>
    </div>
  );
};

export default PostComments