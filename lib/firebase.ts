import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBNV3oSGxVufC2HKXNI6xxdWI_iBeSi6ps",
    authDomain: "ecom-395616.firebaseapp.com",
    projectId: "ecom-395616",
    storageBucket: "ecom-395616.appspot.com",
    messagingSenderId: "410015506120",
    appId: "1:410015506120:web:00a73ce37c227968770ffd",
    measurementId: "G-LZZT4HTRJ1"
};
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);



