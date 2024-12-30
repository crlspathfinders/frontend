const SEND_URL = import.meta.env.VITE_URL;

export let wholeWebsiteData = [];

export let all_mentors;

export let all_users;

export let all_clubs;

export let all_opportunities;

export function updateMentors(mentors) {
	all_mentors = mentors;
}

export function updateUsers(users) {
	all_users = users;
}

export function updateClubs(clubs) {
	all_clubs = clubs;
}

export function updateOpps(opps) {
	all_opportunities = opps;
}

export function updateWholeWebsiteData(id, info, extraInfo={}) { // Add extraInfo later
	const add = {
		id,
		info
	}
	wholeWebsiteData.push(add);
}

export async function getCollection(collection) {
	try {
		console.log("send url: ");
		console.log(SEND_URL);
		const url = SEND_URL + 'read/' + collection;
		console.log(url);
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error("getvals fetching didn't work");
		}
		let resData = await res.json();
		console.log(resData);

		const status = resData.status;
		if (status == 0) {
			const collection = JSON.parse(resData.collection)
			return collection
		} else if (status == -1) {
			return resData.error_message
		}

	} catch (error) {
		console.log("Couldn't retrieve / fetch getvals data: " + error);
		return {"status": -1, "error_message": "Failed to retrieve collection data: " + error};
	}
}

export async function getCollectionDoc(collection, docId) {
	try {
		const url = SEND_URL + 'read/' + collection + '/' + docId;
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error("getvals fetching didn't work");
		}
		let resData = await res.json();

		console.log(resData);
		if (resData.status == 0) {
			return JSON.parse(resData.collid);
		} else if (resData.status == 1) {
			return resData.error_message;
		}

		// return resData;
	} catch (error) {
		console.log("Couldn't retrieve / fetch getvals data: " + error);
		return -1;
	}
}

export async function deleteDoc(collection, id) {
	try {
		const url = SEND_URL + 'delete/' + collection + '/' + id;
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error('Failure to delete id');
		}
		const resData = await res.json();
		const status = resData['status'];
		return status;
	} catch (error) {
		const status = 'Failure to delete id: ' + error;
		console.log(status);
		return status;
	}
}

export async function getBackendCache(collection) {
	const url = SEND_URL + "cache/" + collection;
	const res = await fetch(url);
	if (!res.ok) {
		console.log('Failure to get cached collection');
		throw new Error('Failure to get cached collection');
	}
	const resData = await res.json();
	const result = JSON.parse(resData);
	
	return result;
}
// TODO: Function that brings in data from local storage at a defined value
export function getDataFromLocalStorage(key) {
	try {
		const data = localStorage.getItem(key);
		if (!data) {
			console.error('No data found in local storage for key: ' + key);
		}
		const parsedData = JSON.parse(data);
		return parsedData;
	} catch (error) {
		console.error("Couldn't retrieve data from local storage: " + error);
		return null;
	}
}

export function setDataInLocalStorage(key, data) {
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error("Couldn't set data in local storage: " + error);
	}
}

export function removeDataFromLocalStorage(key) {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error("Couldn't remove data from local storage: " + error);
	}
}

export function clearLocalStorage() {
	try {
		localStorage.clear();
	} catch (error) {
		console.error("Couldn't clear local storage: " + error);
	}
}

export async function updateCache(key) {
	let pulledData;
	if (!localStorage.getItem(key)) {
		console.info(` ${key} not in storage, setting`);
		pulledData = await getCollection(key);
		setDataInLocalStorage(key, pulledData);
	} else {
		pulledData = await getDataFromLocalStorage(key);
	}
	return pulledData;
}

export async function sendMassEmail(collection, subject, body, recipients) {
	const url = SEND_URL + "emailall/";
	const toSend = {
		collection,
		subject,
		body,
		recipients
	}
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(toSend)
	});
	const resData = await res.json();
	console.log(resData);
	return resData;
}