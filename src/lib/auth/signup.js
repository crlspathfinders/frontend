const CURR_URL = "http://127.0.0.1:8000/";

export async function makeUser(email, is_leader, role) {
    try {
        const toSend = {
            email,
            is_leader,
            role
        }
        const url = CURR_URL + "make-user";
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(toSend)
        });
        const resData = await res.json();
        console.log(resData);
        return resData;
    } catch (except) {
        console.log("Failed to make user: " + except);
        return "Failed to make user: " + except;
    }
}