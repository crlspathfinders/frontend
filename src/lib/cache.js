import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { user } from '../stores/auth';
import { getUserDocData } from '$lib/user';
import { getCollection } from "$lib/api";

const cachedData = writable({
	userInfo: null,
	clubs: null
});

function updateCache(key, value) {
	console.log('Updating cache');
	cachedData.update((current) => ({ ...current, [key]: value }));
	console.log('Cache updated' + value);
	if (browser) {
		localStorage.setItem(key, JSON.stringify(value)); // Store in localStorage
		console.log('Browser found');
	} else {
		console.log('No browser found');
	}
}
// Initialize the cache from localStorage on start up.
let storedUserInfo;
let storedClubs;

if (browser) {
	storedUserInfo = localStorage.getItem('userInfo');
	storedClubs = localStorage.getItem('clubs');
}

if (storedUserInfo) {
	updateCache('userInfo', JSON.parse(storedUserInfo));
}

if (storedClubs) {
	updateCache('clubs', JSON.parse(storedClubs));
}

// Expose functions for fetching and updating cached data.
export async function retrieveUserInfo() {
	let userInfo;
	console.log('starting function');
	let email = '';
	user.subscribe(async (value) => {
		if (value) {
			email = value.email;
			userInfo = await getUserDocData(email);
			updateCache('userInfo', userInfo);
			console.log(localStorage.getItem('userInfo'));
			if (typeof cachedData.userInfo === null) {
				console.log('email', email);
			} else {
				console.log('userInfo', userInfo);
				console.log('Finished updateCache');
			}
		} else {
			let userInfo = cachedData.userInfo; // Access current store value.
			console.log('cached data', userInfo);
		}
	});
	return userInfo;
}

export async function retrieveCollectionInfo(collection) {
	let collectionInfo;
	console.log("starting " + collection + " function");

	try {
		collectionInfo = await getCollection(collection);
		updateCache(collection.toLowerCase() + "Info", collectionInfo);
	} catch {
		return "Failed to get collectionInfo";
	}

	return collectionInfo;
}