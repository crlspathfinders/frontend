const SEND_URL = import.meta.env.VITE_URL

export async function createMentor(advisor_email, clubDays, club_description, club_name, president_email, room_number, secret_password, start_time, status, vicePresidentsEmails) {

    let club_days = [];
    let vice_presidents_emails = []

    club_days.push(clubDays);
    vice_presidents_emails.push(vicePresidentsEmails)

    const toSend = {
        advisor_email,
        club_days,
        club_description,
        club_name,
        president_email,
        room_number,
        secret_password,
        start_time,
        status,
        vice_presidents_emails
    }; // Make sure the values here match the ORDER and NAME that is expected in the Python class!

    console.log(toSend)

    try {
        const url = SEND_URL + "creatementor/"; 
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

export async function editMentor(advisor_email, clubDays, club_description, club_name, president_email, room_number, secret_password, start_time, status, vicePresidentsEmails) {

    let club_days = [];
    let vice_presidents_emails = []

    club_days.push(clubDays);
    vice_presidents_emails.push(vicePresidentsEmails)

    const toSend = {
        advisor_email,
        club_days,
        club_description,
        club_name,
        president_email,
        room_number,
        secret_password,
        start_time,
        status,
        vice_presidents_emails
    }; 

    console.log(toSend)

    try {
        const url = SEND_URL + "updatementor/"; 
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