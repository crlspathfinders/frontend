const SEND_URL = import.meta.env.VITE_URL;
const username = import.meta.env.VITE_AUTH_USERNAME;
const password = import.meta.env.VITE_AUTH_PASSWORD;
const encodedCredentials = btoa(`${username}:${password}`); // Base64 encode

export async function sendAlumni(alum) {
    const toSend = alum; // Make sure the values here match the ORDER and NAME that is expected in the Python class! (do this in frontend Svelte)

	try {
		const url = SEND_URL + 'addalumni/';
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-type': 'application/json', "Authorization": `Basic ${encodedCredentials}` },
			body: JSON.stringify(toSend)
		});
		const resData = await res.json();
		const status = resData['status'];
		
		return status;
	} catch (error) {
		console.log('Error: ' + error);
		return -1;
	}
}