import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./userCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed) return;
    try {
        const res = await axios.get(BASE_URL + "/user/feed", {
          withCredentials: true,
        });
        
        console.log("API Response Data:", res.data); 
        
        const feedArray = res?.data?.FEED; 
        
        console.log("Dispatching Array:", feedArray); 
        
        dispatch(addFeed(feedArray));
    }  catch (err) {
      //TODO: handle error
    }
  };

   useEffect(() => {
    getFeed();}, []);
  
 if (!feed) {
    // This will run on the first render when feed is null
    return <h1 className="flex justify-center my-10">Loading...</h1>;
  }

 if (feed.length <= 0)
 return <h1 className="flex justify-center my-10">No new users founds!</h1>;

  return (
    feed && (
      <div className="flex justify-center my-10">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};
export default Feed;