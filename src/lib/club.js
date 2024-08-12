const SEND_URL = import.meta.env.VITE_URL

export async function createClub(advisor_email, clubDays, club_description, club_name, president_email, room_number, start_time, status, vicePresidentsEmails) {

    let club_days = [];
    let vice_president_emails = []

    club_days.push(clubDays);
    vice_president_emails.push(vicePresidentsEmails)

    const secret_password = Math.floor(10000 + Math.random() * 90000);
    console.log(secret_password);

    room_number = parseInt(room_number, 10);

    const toSend = {
        advisor_email: advisor_email,
        club_days: clubDays,
        club_description: club_description,
        club_name: club_name,
        president_email: president_email,
        room_number: room_number,
        secret_password: secret_password,
        start_time: start_time,
        status: status,
        vice_president_emails: vicePresidentsEmails
    }; // Make sure the values here match the ORDER and NAME that is expected in the Python class!

    console.log(toSend)

    try {
        const url = SEND_URL + "createclub/"; 
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

export async function editClub(advisor_email, clubDays, club_description, club_name, president_email, room_number, start_time, status, vicePresidentsEmails, secret_password) {

    let club_days = [];
    let vice_presidents_emails = []

    club_days.push(clubDays);
    vice_presidents_emails.push(vicePresidentsEmails)

    room_number = parseInt(room_number, 10);
    secret_password = parseInt(secret_password, 10);

    const toSend = {
        advisor_email: advisor_email,
        club_days: clubDays,
        club_description: club_description,
        club_name: club_name,
        president_email: president_email,
        room_number: room_number,
        secret_password: secret_password,
        start_time: start_time,
        status: status,
        vice_president_emails: vicePresidentsEmails
    };

    console.log(toSend)

    try {
        const url = SEND_URL + "updateclub/"; 
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

export async function changeStatus(secret_password, status) {
    if (status.localeCompare("Pending") === 0) {
        status = "Approved";
    } else if (status.localeCompare("Approved") === 0) {
        status = "Pending";
    }

    secret_password = parseInt(secret_password, 10);

    const toSend = {
        secret_password: secret_password,
        status: status,
    };

    console.log(toSend)

    try {
        const url = SEND_URL + "changestatus/"; 
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