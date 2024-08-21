const SEND_URL = import.meta.env.VITE_URL

export async function createMentor(firstName, lastName, email, races, religions, gender, languages, academics) {

    const toSend = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        races: races,
        religions: religions,
        gender: gender,
        languages: languages,
        academics: academics
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

export async function editMentor(firstName, lastName, email, races, religions, gender, languages, academics) {

    // races = races.split(",");
    // religions = religions.split(",");
    // gender = gender.split(",");
    // languages = languages.split(",");
    // academics = academics.split(",");

    const toSend = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        races: races,
        religions: religions,
        gender: gender,
        languages: languages,
        academics: academics
    }; // Make sure the values here match the ORDER and NAME that is expected in the Python class!

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
        return status;
    } catch (error) {
        console.log("Error: " + error);
        return -1;
    }
}