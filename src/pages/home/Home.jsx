import { useState } from "react";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import './home.css';

export default function Home() {
  const [isShowLikes, setIsShowLikes] = useState(null)
  
  return (
        <>  
          <Topbar />
          <div className="homeContainer">
            {isShowLikes ? (
              <>
                <Sidebar choosen="likes" setIsShowLikes={setIsShowLikes} />
                <Feed isShowLikes={isShowLikes} />
                <Rightbar />
              </>
            ) : (
              <>
                <Sidebar choosen="feed" setIsShowLikes={setIsShowLikes} />
                <Feed isShowLikes={isShowLikes} />
                <Rightbar />
              </>
            )}
          </div>
        </>
  );
}
