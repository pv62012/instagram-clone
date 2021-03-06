import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyBHoLQ2ixNkAPAmZNvpkHBDJMqv0vfFNbA",
        authDomain: "namaste-6ee24.firebaseapp.com",
        projectId: "namaste-6ee24",
        storageBucket: "namaste-6ee24.appspot.com",
        messagingSenderId: "484937616383",
        appId: "1:484937616383:web:ebf1f314a0f896e24835ca",
        measurementId: "G-39VHGJLRH2",
    
});


const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };