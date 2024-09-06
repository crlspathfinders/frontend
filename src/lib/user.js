// import { getAuth, getIdToken } from "firebase/auth";
import { auth } from './auth/firebaseConfig';

const SEND_URL = import.meta.env.VITE_URL

export const roleChoices = [
    { value: "Member", name: "Member", color: "light"},
    { value: "Mentor", name: "Mentor", color: "blue"},
    { value: "Leader", name: "Leader", color: "green"},
    { value: "Advisor", name: "Advisor", color: "yellow"},
    { value: "Admin", name: "Admin", color: "dark"},
    { value: "Super Admin", name: "Super Admin", color: "purple"}
]

export async function editUser(email, is_leader, password, role) {

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
    // console.log(auth.currentUser["email"]);
    const token = await getIdToken(auth.currentUser);
    console.log(token);
    const response = await fetch(SEND_URL + 'user-info', {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }

    const resData = await response.json();
    // console.log(resData);
    return resData;
}

export async function getUserDocData(email) {
    const url = SEND_URL + "getuserdocdata" + "/" + email;

    try {
        const res = await fetch(url);
        if (!res.ok) { throw new Error("Failed to getuserdocdata"); }

        const resData = await res.json();
        return resData;
    } catch (error) {
        return null;
    }
}

export async function toggleClub(userEmail, clubId) {
    const url = SEND_URL + "toggleclub/" + userEmail + "/" + clubId;
    try {
        const res = await fetch(url);
        if (!res.ok) { return "Failed to toggle club"; }
    
        const resData = await res.json();
        return resData;
    } catch (error) {
        return "Failed to toggle club: " + error;
    }
}

export async function changeUserRole(email, newRole) {
    const url = SEND_URL + "changerole";
    try {
        const toSend = {
            email,
            new_role: newRole
        };
        console.log(toSend);
        const res = await fetch(url, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(toSend)
        });
        console.log(res);
    } catch (error) {
        console.log("Error changing role: " + error);
    }
}

export async function deleteUser(email) {
    const url = SEND_URL + "deleteuser/" + email;
    try {
        const res = await fetch(url);
        if (!res.ok) { console.log("Failed to fetch url"); }
        const resData = await res.json();
        console.log(resData);
        return resData;
    } catch (error) {
        console.log("Failed to delete user: " + error);
    }
}

export async function toggleLeaderMentor(email, leaderMentor, toggle) {
    const toSend = {
        email,
        leader_mentor: leaderMentor,
        toggle
    }
    const url = SEND_URL + "toggleleadermentor";
    console.log(toSend);
    const res = await fetch(url, {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(toSend)
    });
}