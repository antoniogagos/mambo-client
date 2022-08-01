import * as firebase from "firebase/app"
import "firebase/auth";
import "firebase/analytics"; 
import "firebase/firestore";
import "firebase/functions";
const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FB_KEY,
  authDomain: process.env.REACT_APP_FB_DOMAIN,
  databaseURL: process.env.REACT_APP_FB_DATABASE,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};
firebase.initializeApp(FIREBASE_CONFIG);
firebase.analytics();
const db = firebase.firestore();
export { firebase, db };