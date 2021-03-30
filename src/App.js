
import { useState, useEffect } from 'react';
import './App.css';
import Post from './pages/Post';
import {db,auth} from './firebase'
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { Button } from '@material-ui/core';
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ImageUpload from './components/ImageUpload';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    borderRadius: "10px",
    width: "300px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {

  const [post, setPost] = useState([]);
  const [open, setOpen] = useState(false)
  const classes = useStyles();
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [openSignin, setOpenSignin] = useState(false)
  useEffect(() => {
    const unsubscribe=auth.onAuthStateChanged((authUser) => {
      if (authUser) {
         //user has logged in
        console.log(authUser);
        setUser(authUser);
       
      } else {
        //user has logged out
        setUser(null)
       }
    })
    return () => {
      //perform some cleanup
      unsubscribe();
    }
  }, [user]);
  
  //always use onSnapShot for realtime updates 
  useEffect(() => {
    //we add a uid for each post and by this we can show its for a particular user that sign in
    // db.collection("posts")
    //   .where("uid", "==", user.uid)
    //   .onSnapshot((snapshot) => {
    //     setPost(
    //       snapshot.docs.map((doc) => ({
    //         id: doc.id,
    //         posts: doc.data(),
    //       }))
    //     );
    //   });
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPost(snapshot.docs.map(doc => ({
        id:doc.id,
        posts: doc.data()
      })));
    })
    // db.collection('users').doc(user.uid).collection('posts').onSnapshot(snapshot => {
    //   setPost(snapshot.docs.map(doc => ({
    //     id: doc.id,
    //     posts:doc.data()
    //   })))
    // })
    // return () => {
    //   cleanup
    // }
  }, []) 


  const handleLogin = (event ) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    setOpenSignin(false)
  }

  const handleSignin = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false)
  };
  // modal styles and animation


  //modal style and animation end
  return (
    <div className="app">
      <header className="app_header">
        <img className="app_headerImage" src="/images/namasteLogoB.png" />

        {user ? (
          <Button onClick={() => auth.signOut()} className="logoutbtn">
            Logout
          </Button>
        ) : (
          <div className="app_loginContainer">
            <Button className="logoutbtn" onClick={() => setOpenSignin(true)}>
              Signin
            </Button>
            <Button className="logoutbtn" onClick={() => setOpen(true)}>
              Signup
            </Button>
          </div>
        )}
      </header>

      {/* model for login */}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openSignin}
        className={classes.modal}
        onClose={() => setOpenSignin(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openSignin}>
          <div className={classes.paper}>
            <div className="modal_logo">Login Yourself</div>
            <form action="">
              <div className="modal_input">
                <TextField
                  id="email_input"
                  label="Email"
                  type="text"
                  className="textfield"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  id="password_input"
                  label="Password"
                  type="password"
                  className="textfield"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="login_btn" onClick={handleLogin}>
                  Login
                </Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>

      {/* modal for signup */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        className={classes.modal}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div className="modal_logo">Join Us</div>
            <form action="">
              <div className="modal_input">
                <TextField
                  id="username_input"
                  label="Username"
                  type="text"
                  className="textfield"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  id="email_input"
                  label="Email"
                  type="text"
                  className="textfield"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  id="password_input"
                  label="Password"
                  type="password"
                  className="textfield"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="login_btn" onClick={handleSignin}>
                  Signup
                </Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>

      {/* modal for signup end here */}
      {post.map(({ id, posts }) => (
        <Post
          key={id}
          postId={id}
          user={user}
          username={posts.username}
          caption={posts.caption}
          imageUrl={posts.imageUrl}
        />
      ))}

      {user?.displayName ? (
        <ImageUpload username={user.displayName} uid={ user.uid}/>
      ) : (
        <h3>Sorry you need to Signin For upload posts </h3>
      )}
    </div>
  );
}

export default App;
