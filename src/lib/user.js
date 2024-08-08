import { getAuth, getIdToken } from "firebase/auth";
import { auth } from './auth/firebaseConfig';

const SEND_URL = import.meta.env.VITE_URL

export async function createUser(email, is_leader, password, role) {

    // HASH THE PASSWORD HERE
        // OR IN BACKEND (?)

    const toSend = {
        email,
        is_leader,
        password,
        role
    }; // Make sure the values here match the ORDER and NAME that is expected in the Python class!

    console.log(toSend)

    try {
        const url = SEND_URL + "createuser/"; 
        const res = await fetch(url, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(toSend)
        });
        const resData = await res.json();
        const status = resData["status"];
        console.log("Successfully retrieved message: " + status);
        // location.reload(); // Change later, etc.
        return status;
    } catch (error) {
        console.log("Error: " + error);
        return -1;
    }
}

export async function editClub(email, is_leader, password, role) {

    const toSend = {
        email,
        is_leader,
        password,
        role
    };

    console.log(toSend)

    try {
        const url = SEND_URL + "updateuser/"; 
        const res = await fetch(url, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(toSend)
        });
        const resData = await res.json();
        const status = resData["status"];
        console.log("Successfully retrieved message: " + status);
        // location.reload(); // Change later, etc.
        console.log(status);
        return status;
    } catch (error) {
        console.log("Error: " + error);
        return -1;
    }
}

let isLoggedIn = false;

function toggleIsLoggedIn() { isLoggedIn = !isLoggedIn; }

export function getLoggedIn() { return isLoggedIn; }

export async function fetchUserInfo() {
    if (!auth.currentUser) {
        toggleIsLoggedIn();
        // return {status: "User is not logged in"};
    } else {
        console.log(auth.currentUser["email"]);
        const token = await getIdToken(auth.currentUser);
        console.log(token);
        const response = await fetch('/user-info', {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
    
        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }
    
        const status = response.json();
        console.log(status);
        return status["status"];
    }
}