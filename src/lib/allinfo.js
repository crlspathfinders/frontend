const SEND_URL = import.meta.env.VITE_URL; 

export async function updateAllInfo(doc, vals) {
    const url = SEND_URL + "update/";
    const toSend = {
        doc,
        vals
    };
    console.log(toSend);
    const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(toSend)
	});
    const resData = await res.json();
    if (resData["status"] == 0) { return {"status": 0} }
    return {"status": -1, "error_message": resData["error_message"]}
}

export async function addDocument(doc) {
    const url = SEND_URL + "adddocument/";
    const toSend = {
        doc: doc
    };
    console.log(toSend);
    const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(toSend)
	});
    const resData = await res.json();
    if (resData["status"] == 0) { return {"status": 0} }
    console.log(resData["error_message"]);
    return {"status": -1, "error_message": resData["error_message"]}
}