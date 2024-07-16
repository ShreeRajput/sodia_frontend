import { useContext, useEffect, useState } from 'react';
import Post from '../post/Post';
import Share from '../postShare/Share';
import { UserContext } from "../../context/userContext.js";
import './feed.css';
import axios from 'axios';

export default function Feed({isShowLikes, username}) {
    const [posts, setPosts] = useState([]);
    const [user] = useContext(UserContext);
    const [isFetching,setIsFetching] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let response;
                if (username) {
                    response = await axios.get(`/posts/profile/${username}`);
                }else if(isShowLikes==="likes"){
                    response = await axios.get(`/posts/likes/likes/${user.details._id}`);
                }else if(isShowLikes==="bookmarks"){
                    response = await axios.get(`/posts/likes/bookmarks/${user.details._id}`);
                }else {
                    response = await axios.get(`/posts/timeline/${user.details._id}`);
                }
            
                // Sort the posts by createdAt in descending order
                const sortedPosts = response.data.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt));            
                setPosts(sortedPosts);
                setIsFetching(false)
            } 
            catch (error) {
                setIsFetching(false)
                
                console.error(error)
            }
        };

        if (user.details._id) {
            fetchPosts();
        }
    }, [username,isShowLikes, user.details._id]);

    return (
        <div className='feed'>
            <div className="feedWrapper">
                {username ? username===user.details.username ? <div style={{marginTop: '30px'}}><Share /></div> : null : !isShowLikes && <Share />}
                {isShowLikes==="likes" && <h2 className='likeTitle'>Liked Posts</h2>}
                {isShowLikes==="bookmarks" && <h2 className='likeTitle'>Bookmarked Posts</h2>}
                {isFetching ? <div className='loading'><div className='spinn'></div></div>
                    :
                    posts.length===0 && <div className='noPosts'>No Posts yet</div>
                }
                {posts.map((p) => (
                    <Post key={p._id} post={p} />
                ))}
            </div>
        </div>
    );
}