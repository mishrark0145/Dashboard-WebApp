import { getStorage } from "@firebase/storage";
import {initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {getAuth} from 'firebase/auth';


const firebaseConfigResume = {
  apiKey: "AIzaSyDhIpEfvLCt3t15EEjxD1aLGwKPJiCPHT0",
  authDomain: "maindash-77910.firebaseapp.com",
  databaseURL: "https://maindash-77910-default-rtdb.firebaseio.com",
  projectId: "maindash-77910",
  storageBucket: "maindash-77910.appspot.com",
  messagingSenderId: "365502471067",
  appId: "1:365502471067:web:e4c2a57d86f978f0435f3e"
};

// Initialize Firebase
const appResume = initializeApp(firebaseConfigResume , 'resumeApp');

const dbResume = getDatabase(appResume);
const storageResume = getStorage(appResume);
const authResume = getAuth(appResume);


export {dbResume,appResume,authResume,storageResume};
