import { Button } from '@material-ui/core'
import React,{useState} from 'react'
import { storage,db } from '../firebase'
import firebase from "firebase";
import './ImageUpload.css'

function ImageUpload({username, uid}) {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress <funtioon className=""></funtioon>
                const progress = Math.round(
                     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
               //complete function
                storage.ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                    //post image inside db
                        
                        db
                          .collection("posts")
                          .add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                              username: username,
                            uid:uid
                          });
                        // db.collection("users").doc(uid).collection("posts").add({
                        //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        //     caption: caption,
                        //     imageUrl: url,
                        //     username: username
                        // });   this is not need more bcz we add a uid for each post and by this we can show its for a particular user that sign in 
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                })
            }
        )
    }
    return (
      <div className="image_upload">
       
            <progress value={progress} max="100"/>
            <input type="text" placeholder="Enter a caption..." onChange={event=>setCaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
      </div>
    );
}

export default ImageUpload
