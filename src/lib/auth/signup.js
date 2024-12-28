const SEND_URL = import.meta.env.VITE_URL;

export async function makeUser(email, is_leader, role, leading, joined_clubs) {
	try {
		const toSend = {
			email,
			is_leader,
			role,
			leading,
			joined_clubs
		};
		const url = SEND_URL + 'make-user';
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(toSend)
		});
		const resData = await res.json();
		console.log(resData);
		return { status: resData };
	} catch (except) {
		console.log('Failed to make user: ' + except);
		return { status: 'Failed to make user: ' + except };
	}
}
