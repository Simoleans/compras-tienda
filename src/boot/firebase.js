import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyCSPP0J-DbWC-qmUGzcfIpPq7EAT-pQZz8",
    authDomain: "minimarket-5ad92.firebaseapp.com",
    projectId: "minimarket-5ad92",
    storageBucket: "minimarket-5ad92.appspot.com",
    messagingSenderId: "204622694115",
    appId: "1:204622694115:web:d1b2058be43cadf9b5a7d6"
};
  // Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();

export {firebaseApp, db };