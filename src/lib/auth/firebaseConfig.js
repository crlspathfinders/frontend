import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAJ2VJSxD7StSrBH_PzrlHdM6VyxaLfCQ0",
    authDomain: "crlspathfinders-82886.firebaseapp.com",
    projectId: "crlspathfinders-82886",
    storageBucket: "crlspathfinders-82886.appspot.com",
    messagingSenderId: "545685285112",
    appId: "1:545685285112:web:7eabce669a09ddd52ef30d",
    measurementId: "G-JDLY6W8N7M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };