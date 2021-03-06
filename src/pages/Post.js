import { Avatar, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import "../style/Post.css"
import firebase from "firebase";

function Post({postId, user,username, caption, imageUrl }) {
  
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('')
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp','desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()
          ));
      })
    }

    // console.log("i am commment>>>>", user.displayName);
    return () => {
      unsubscribe();
    }
  }, [postId]) 
  
  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    setComment('')
};
    return (
      <div className="post">
        <div className="post_header">
          <Avatar
            className="post_avatar"
            alt="profile photo"
            src="https://images.unsplash.com/photo-1611095788646-86737a001141?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
          />
          <h2>{username}</h2>
        </div>

        {/* header > avatar +username */}
        <img src={imageUrl} alt="post_image" className="post_image" />
        {/* images */}
        {/* username caption */}
        <h4 className="post_text">
          <strong>{username}</strong> {caption}
        </h4>

        {user && (
          <form action="" className="post_commentsBox">
            <input
              type="text"
              className="post_input"
              placeholder="Add Comments"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              disabled={!comment}
              className="post_button"
              type="submit"
              onClick={postComment}
            >
              Post
            </Button>
          </form>
        )}

        <div className="post_comment">
          {comments.map((data) => (
            <p>
              <strong>{data.username} </strong>
              {data.text}
            </p>
          ))}
        </div>
      </div>
    );
}

export default Post
