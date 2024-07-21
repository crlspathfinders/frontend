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