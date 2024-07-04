import { getStorage } from "@firebase/storage";
import {initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfigForm = {
    apiKey: "AIzaSyDFzOvJZJUYkqLiCNnf4aEnPD3D-srQJtI",
  authDomain: "mainform-e2384.firebaseapp.com",
  databaseURL: "https://mainform-e2384-default-rtdb.firebaseio.com",
  projectId: "mainform-e2384",
  storageBucket: "mainform-e2384.appspot.com",
  messagingSenderId: "1036444667898",
  appId: "1:1036444667898:web:b5176eff205dee18a49e43"
  };

const appForm = initializeApp(firebaseConfigForm , 'formApp');

const dbForm = getDatabase(appForm);
const storageForm = getStorage(appForm);

export {dbForm,appForm,storageForm};