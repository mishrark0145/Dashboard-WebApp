import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDFzOvJZJUYkqLiCNnf4aEnPD3D-srQJtI",
  authDomain: "mainform-e2384.firebaseapp.com",
  databaseURL: "https://mainform-e2384-default-rtdb.firebaseio.com",
  projectId: "mainform-e2384",
  storageBucket: "mainform-e2384.appspot.com",
  messagingSenderId: "1036444667898",
  appId: "1:1036444667898:web:b5176eff205dee18a49e43"
};

const app = initializeApp(firebaseConfig);

const storageRef = getStorage(app);
const databaseRef = getDatabase(app);

export { storageRef as storage,  databaseRef as database };