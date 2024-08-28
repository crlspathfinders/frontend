const SEND_URL = import.meta.env.VITE_URL

export async function getCollection(collection) {
    try {
        const url = SEND_URL + "read/" + collection;
        const res = await fetch(url);
        if (!res.ok) { throw new Error("getvals fetching didn't work"); }
        let resData = await res.json();
        resData = JSON.parse(resData);

        console.log(resData);

        return resData;
        
    } catch (error) {
        console.log("Couldn't retrieve / fetch getvals data: " + error);
        return -1;
    }
}

export async function getCollectionDoc(collection, docId) {
    try {
        const url = SEND_URL + "read/" + collection + "/" + docId;
        const res = await fetch(url);
        if (!res.ok) { throw new Error("getvals fetching didn't work"); }
        let resData = await res.json();

        console.log(resData);

        return resData;
        
    } catch (error) {
        console.log("Couldn't retrieve / fetch getvals data: " + error);
        return -1;
    }
}

export async function deleteDoc(collection, id) {
    try {
        const url = SEND_URL + "delete/" + collection + "/" + id;
        const res = await fetch(url);
        if (!res.ok) { throw new Error("Failure to delete id"); }
        const resData = await res.json();
        const status = resData["status"];
        location.reload();
        return status;
    } catch (error) {
        const status = "Failure to delete id: " + error;
        console.log(status);
        return status;
    }
}