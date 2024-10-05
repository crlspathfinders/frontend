<script>
    import { writable } from "svelte/store";

    let result = writable(null); 
    let num1;
    let num2;

    // API:
    async function addNums(num1, num2) {
        const url = "http://127.0.0.1:8000/" + "add/" + num1 + "/" + num2;
        const res = await fetch(url);
        console.log(res);
        const resData = await res.json();
        console.log(resData);
        result.set(resData["data"]);
    }
</script>

<form on:submit={async() => {
    await addNums(num1, num2);
}}>
    <label for="num1"></label>
    <input type="number" bind:value={num1}>
    <label for="num2"></label>
    <input type="number" bind:value={num2}>
    <input type="submit">
</form>

<p>
    result: {$result}
</p>